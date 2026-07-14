// ============================================================
// BACKEND THẬT — nói chuyện với Supabase (tài khoản ẩn danh +
// database + kho ảnh + realtime).
//
// Module này export ĐÚNG các hàm giống store.js, nên khi bật lên
// (ở backend.js) các màn hình game không cần sửa một dòng nào.
//
// ⚠️ Cần trước khi dùng:
//   1. npm install @supabase/supabase-js
//   2. Điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào file .env
//   3. Chạy schema.sql rồi seed.sql trên Supabase
//
// Mọi thay đổi 🍩 đều gọi RPC (rpc_checkin, rpc_buy_item, ...) —
// máy chủ tự tính thưởng/giá, app KHÔNG tự cộng tiền được.
// ============================================================
import { createClient } from '@supabase/supabase-js'
import { itemById, SLOTS } from './items.js'

const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

// ---- Catalog địa điểm/nhiệm vụ: nạp từ máy chủ khi khởi động ----
export let LOCATIONS = []
export const MISSIONS = [
  { id: 'first-checkin', goal: 1, progress: (s) => Object.keys(s.visited).length },
  { id: 'three-checkins', goal: 3, progress: (s) => Object.keys(s.visited).length },
  { id: 'all-checkins', goal: 6, progress: (s) => Object.keys(s.visited).length },
  { id: 'first-friend', goal: 1, progress: (s) => s.friends.length },
  { id: 'first-item', goal: 1, progress: (s) => s.ownedItems.length },
  { id: 'three-photos', goal: 3, progress: (s) => Object.values(s.visited).filter((v) => v.photo).length },
]

const EMPTY = { donuts: 0, ownedItems: [], equipped: {}, visited: {}, posts: [], friends: [], claimed: [] }
let state = { ...EMPTY }
let toast = null
let me = null
const listeners = new Set()

const emit = () => listeners.forEach((fn) => fn())
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
export const getState = () => state
export const getToast = () => toast

export function showToast(msg) {
  toast = { id: Date.now(), msg }
  emit()
  setTimeout(() => { toast = null; emit() }, 2600)
}

// ---------- KHỞI ĐỘNG ----------
export async function init() {
  try {
    await start()
  } catch (e) {
    showToast('Lỗi kết nối: ' + (e?.message || e))
    console.error('[NNN] init lỗi:', e)
  }
}

async function start() {
  // Đăng nhập ẩn danh: mở app là có "thẻ" vô hình ngay
  const { data: { session } } = await sb.auth.getSession()
  if (!session) {
    const { error } = await sb.auth.signInAnonymously()
    if (error) throw error
  }
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('không lấy được tài khoản')
  me = user.id

  // Nạp catalog địa điểm + tên/thưởng nhiệm vụ
  const [{ data: locs }, { data: miss }] = await Promise.all([
    sb.from('catalog_locations').select('*'),
    sb.from('catalog_missions').select('*'),
  ])
  LOCATIONS = locs || []
  const missMeta = Object.fromEntries((miss || []).map((m) => [m.id, m]))
  for (const m of MISSIONS) { m.name = missMeta[m.id]?.name; m.reward = missMeta[m.id]?.reward }

  await refresh()
  await claimDailyLogin()
  subscribeRealtime()
}

// ---------- NẠP LẠI TRẠNG THÁI TỪ MÁY CHỦ ----------
async function refresh() {
  const [profile, owned, visits, claims, friendRows, feed] = await Promise.all([
    sb.from('profiles').select('*').eq('id', me).single(),
    sb.from('owned_items').select('item_id').eq('profile_id', me),
    sb.from('visits').select('*').eq('profile_id', me),
    sb.from('mission_claims').select('mission_id').eq('profile_id', me),
    sb.from('friendships').select('friend_id, profiles!friendships_friend_id_fkey(display_name, equipped)').eq('profile_id', me),
    sb.from('posts').select('*, profiles(display_name)').order('created_at', { ascending: false }).limit(50),
  ])

  const visited = {}
  for (const v of visits.data || []) {
    visited[v.location_id] = { at: new Date(v.created_at).getTime(), photo: photoUrl(v.photo_path) }
  }

  state = {
    donuts: profile.data?.donuts ?? 0,
    equipped: profile.data?.equipped ?? {},
    ownedItems: (owned.data || []).map((r) => r.item_id),
    visited,
    claimed: (claims.data || []).map((r) => r.mission_id),
    friends: (friendRows.data || []).map((r) => ({
      id: r.friend_id, name: r.profiles?.display_name, outfit: r.profiles?.equipped ?? {},
    })),
    posts: (feed.data || []).map(mapPost),
  }
  emit()
}

function photoUrl(path) {
  if (!path) return null
  return sb.storage.from('photos').getPublicUrl(path).data.publicUrl
}

function mapPost(p) {
  const who = p.profile_id === me ? 'Bạn' : p.profiles?.display_name || 'Người chơi'
  const at = new Date(p.created_at).getTime()
  if (p.type === 'photo') {
    return { id: p.id, type: 'photo', who, at, photo: photoUrl(p.payload.photo_path), locName: LOCATIONS.find((l) => l.id === p.payload.location_id)?.name }
  }
  const itemName = p.payload.item_id ? itemById(p.payload.item_id)?.name : p.payload.set_id
  return { id: p.id, type: 'outfit', who, at, itemName }
}

// ---------- REALTIME: nghe bạn bè thay đồ / đăng feed ----------
function subscribeRealtime() {
  sb.channel('social')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, refresh)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, refresh)
    .subscribe()
}

// ---------- CÁC HÀNH ĐỘNG (đều qua RPC, máy chủ kiểm tra) ----------
async function call(fn, args, okMsg) {
  const { data, error } = await sb.rpc(fn, args)
  if (error) { showToast(error.message); return }
  await refresh()
  if (okMsg) showToast(typeof okMsg === 'function' ? okMsg(data) : okMsg)
  return data
}

export async function checkIn(locationId, photoDataUrl) {
  let path = null
  if (photoDataUrl) {
    const blob = await (await fetch(photoDataUrl)).blob()
    path = `${me}/${locationId}-${Date.now()}.jpg`
    await sb.storage.from('photos').upload(path, blob, { contentType: 'image/jpeg' })
  }
  await call('rpc_checkin', { p_location_id: locationId, p_photo_path: path }, (r) => `Check-in thành công! +${r} 🍩`)
}

export const buyItem = (itemId) =>
  call('rpc_buy_item', { p_item_id: itemId }, `Đã sắm "${itemById(itemId)?.name}"!`)

export const buySet = (setId) =>
  call('rpc_buy_set', { p_set_id: setId }, 'Đã sắm trọn bộ!')

export const claimMission = (missionId) =>
  call('rpc_claim_mission', { p_mission_id: missionId }, (r) => `Nhận thưởng nhiệm vụ +${r} 🍩`)

// Bản cloud tự nhận thưởng đăng nhập trong init(); export no-op để
// backend.js giữ đúng bộ hàm giống store.js (main.jsx gọi được an toàn).
export const dailyLogin = () => {}
const claimDailyLogin = () => call('rpc_daily_login', {}, (r) => (r > 0 ? `Chào mừng trở lại! +${r} 🍩` : null))

// Mặc đồ đã có: cập nhật trực tiếp cột equipped (được phép), rồi ghi feed
export async function equipItem(itemId) {
  const item = itemById(itemId)
  if (!item || !state.ownedItems.includes(itemId)) return
  await sb.from('profiles').update({ equipped: { ...state.equipped, [item.slot]: itemId } }).eq('id', me)
  await sb.from('posts').insert({ profile_id: me, type: 'outfit', payload: { item_id: itemId } })
  await refresh()
}

export async function unequipSlot(slot) {
  await sb.from('profiles').update({ equipped: { ...state.equipped, [slot]: null } }).eq('id', me)
  await refresh()
}

// Kết bạn bằng mã: bản thật sẽ có màn nhập mã bạn bè.
// Giữ tên addDemoFriend để UI không phải đổi; sau sẽ thay bằng addFriendByCode.
export function addDemoFriend() {
  showToast('Bản cloud: kết bạn bằng mã người chơi (sắp thêm màn nhập mã).')
}

export function resetGame() {
  showToast('Bản cloud: dữ liệu nằm trên tài khoản, không xóa cục bộ.')
}
