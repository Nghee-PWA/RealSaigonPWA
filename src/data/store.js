// ============================================================
// TRUNG TÂM DỮ LIỆU CỦA GAME
//
// HIỆN TẠI (chế độ demo): mọi dữ liệu lưu ngay trên máy người
// chơi (localStorage). Xóa dữ liệu trình duyệt = mất tiến trình.
//
// SAU NÀY: thay phần load/save và các action bên dưới bằng lời
// gọi Supabase (tài khoản ẩn danh + database + kho ảnh). Các màn
// hình game không cần sửa gì — chúng chỉ nói chuyện với file này.
//
// Danh mục đồ đạc/trang phục nằm riêng ở items.js.
// ============================================================
import { DEFAULT_OUTFIT, itemById, setById } from './items.js'

const SAVE_KEY = 'nnn-save-v3'

// ---- Địa điểm khám phá (tọa độ thật ở Sài Gòn) ----
export const LOCATIONS = [
  { id: 'nha-tho-duc-ba', name: 'Nhà thờ Đức Bà', desc: 'Biểu tượng hơn 140 năm tuổi của Sài Gòn.', lat: 10.7798, lng: 106.699, reward: 30 },
  { id: 'buu-dien-tp', name: 'Bưu điện Thành phố', desc: 'Kiến trúc Pháp cổ tuyệt đẹp, ngay cạnh Nhà thờ Đức Bà.', lat: 10.7799, lng: 106.6999, reward: 20 },
  { id: 'cho-ben-thanh', name: 'Chợ Bến Thành', desc: 'Khu chợ nổi tiếng nhất Sài Gòn, thiên đường ẩm thực.', lat: 10.7721, lng: 106.698, reward: 25 },
  { id: 'nguyen-hue', name: 'Phố đi bộ Nguyễn Huệ', desc: 'Con phố sôi động nhất mỗi buổi tối cuối tuần.', lat: 10.7743, lng: 106.7038, reward: 20 },
  { id: 'dinh-doc-lap', name: 'Dinh Độc Lập', desc: 'Di tích lịch sử giữa lòng thành phố.', lat: 10.7772, lng: 106.6958, reward: 30 },
  { id: 'landmark-81', name: 'Landmark 81', desc: 'Tòa nhà cao nhất Việt Nam bên bờ sông Sài Gòn.', lat: 10.7951, lng: 106.7218, reward: 35 },
]

// ---- Nhiệm vụ (progress tính tự động từ dữ liệu game) ----
export const MISSIONS = [
  { id: 'first-checkin', name: 'Check-in địa điểm đầu tiên', reward: 20, goal: 1, progress: (s) => Object.keys(s.visited).length },
  { id: 'three-checkins', name: 'Check-in 3 địa điểm', reward: 40, goal: 3, progress: (s) => Object.keys(s.visited).length },
  { id: 'all-checkins', name: 'Khám phá đủ 6 địa điểm', reward: 100, goal: 6, progress: (s) => Object.keys(s.visited).length },
  { id: 'first-friend', name: 'Kết bạn đầu tiên', reward: 20, goal: 1, progress: (s) => s.friends.length },
  { id: 'first-item', name: 'Sắm món đồ đầu tiên', reward: 30, goal: 1, progress: (s) => s.ownedItems.length },
  { id: 'three-photos', name: 'Có 3 tấm ảnh trong Saigon Diary', reward: 50, goal: 3, progress: (s) => Object.values(s.visited).filter((v) => v.photo).length },
]

// Bạn bè demo — sau này thay bằng người chơi thật từ Supabase
const FRIEND_POOL = [
  { name: 'Bé Bánh Mì', outfit: { ...DEFAULT_OUTFIT, bg: 'bg-sunset', hair: 'hair-short-pink', shirt: 'shirt-gold', pants: 'pants-blue', accL: 'banh-mi' } },
  { name: 'Cô Ba Sài Gòn', outfit: { ...DEFAULT_OUTFIT, bg: 'bg-mint', hair: 'hair-long-black', shirt: 'ao-dai-red', pants: 'pants-brown', hat: 'non-la', accR: 'flag' } },
  { name: 'Chú Xích Lô', outfit: { ...DEFAULT_OUTFIT, bg: 'bg-night', shirt: 'shirt-green', pants: 'pants-blue', hat: 'cap-blue', glasses: 'shades', accR: 'coffee' } },
  { name: 'Mèo Quận 1', outfit: { ...DEFAULT_OUTFIT, bg: 'bg-sunset', hair: 'hair-long-black', shirt: 'shirt-blue', pants: 'shorts-green', glasses: 'round-glasses', accL: 'balloon' } },
]

// ---- Trạng thái game ----
// Người chơi mới: nhân vật vanilla trơn + đủ 🍩 để sắm ngay 2 món
// (ví dụ tóc + áo) trong ngày đầu — tạo cảm giác "của mình" tức thì.
const DEFAULT_STATE = {
  donuts: 50,
  ownedItems: [],
  equipped: { ...DEFAULT_OUTFIT },
  visited: {}, // { locationId: { at, photo } }
  posts: [], // bảng tin: check-in của mình + hoạt động của bạn bè
  friends: [], // [{ id, name, outfit }]
  claimed: [], // nhiệm vụ đã nhận thưởng
  lastLogin: null, // ngày nhận thưởng đăng nhập gần nhất (YYYY-MM-DD)
  loginStreak: 0, // số ngày đăng nhập liên tục
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    // dữ liệu hỏng thì chơi lại từ đầu
  }
  return structuredClone(DEFAULT_STATE)
}

let state = load()
let toast = null
const listeners = new Set()

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    toast = { id: Date.now(), msg: 'Bộ nhớ máy đầy — ảnh mới có thể không được lưu' }
  }
}

function emit() {
  listeners.forEach((fn) => fn())
}

function set(patch) {
  state = { ...state, ...patch }
  save()
  emit()
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const getState = () => state
export const getToast = () => toast

export function showToast(msg) {
  toast = { id: Date.now(), msg }
  emit()
  setTimeout(() => {
    toast = null
    emit()
  }, 2600)
}

// ---- Các hành động trong game ----

export function checkIn(locationId, photo) {
  const loc = LOCATIONS.find((l) => l.id === locationId)
  if (!loc || state.visited[locationId]) return
  const post = { id: `me-${Date.now()}`, type: 'photo', who: 'Bạn', locName: loc.name, photo, at: Date.now() }
  set({
    donuts: state.donuts + loc.reward,
    visited: { ...state.visited, [locationId]: { at: Date.now(), photo } },
    posts: [post, ...state.posts],
  })
  showToast(`Check-in thành công! +${loc.reward} 🍩`)
}

function outfitPost(who, itemName) {
  return { id: `${who}-outfit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type: 'outfit', who, itemName, at: Date.now() }
}

export function buyItem(itemId) {
  const item = itemById(itemId)
  if (!item || state.ownedItems.includes(itemId) || state.donuts < item.price) return
  set({
    donuts: state.donuts - item.price,
    ownedItems: [...state.ownedItems, itemId],
    equipped: { ...state.equipped, [item.slot]: itemId },
    posts: [outfitPost('Bạn', item.name), ...state.posts],
  })
  showToast(`Đã sắm "${item.name}"!`)
}

export function equipItem(itemId) {
  const item = itemById(itemId)
  if (!item || !state.ownedItems.includes(itemId)) return
  set({
    equipped: { ...state.equipped, [item.slot]: itemId },
    posts: [outfitPost('Bạn', item.name), ...state.posts],
  })
}

export function unequipSlot(slot) {
  set({ equipped: { ...state.equipped, [slot]: null } })
}

export function buySet(setId) {
  const s = setById(setId)
  if (!s || state.donuts < s.price) return
  const newItems = s.items.filter((id) => !state.ownedItems.includes(id))
  const equipped = { ...state.equipped }
  for (const id of s.items) equipped[itemById(id).slot] = id
  set({
    donuts: state.donuts - s.price,
    ownedItems: [...state.ownedItems, ...newItems],
    equipped,
    posts: [outfitPost('Bạn', s.name), ...state.posts],
  })
  showToast(`Đã sắm trọn bộ "${s.name}"!`)
}

export function addDemoFriend() {
  const next = FRIEND_POOL.find((f) => !state.friends.some((fr) => fr.name === f.name))
  if (!next) {
    showToast('Hết bạn demo rồi! Bản thật sẽ kết bạn qua Supabase.')
    return
  }
  const friend = { id: `f-${Date.now()}`, ...next }
  const shirt = itemById(next.outfit.shirt)
  set({
    friends: [...state.friends, friend],
    posts: [outfitPost(friend.name, shirt.name), ...state.posts],
  })
  showToast(`${friend.name} đã trở thành bạn của bạn!`)
}

export function claimMission(missionId) {
  const m = MISSIONS.find((x) => x.id === missionId)
  if (!m || state.claimed.includes(missionId) || m.progress(state) < m.goal) return
  set({ donuts: state.donuts + m.reward, claimed: [...state.claimed, missionId] })
  showToast(`Nhận thưởng nhiệm vụ +${m.reward} 🍩`)
}

export function resetGame() {
  state = structuredClone(DEFAULT_STATE)
  save()
  emit()
  showToast('Đã chơi lại từ đầu!')
}

// ---- Thưởng đăng nhập hằng ngày (động cơ giữ chân chính) ----
// Ngày 1: +10, mỗi ngày liên tục +5, tối đa +30/ngày. Đứt chuỗi thì về +10.
export function dailyLogin() {
  const today = new Date().toISOString().slice(0, 10)
  if (state.lastLogin === today) return // hôm nay nhận rồi
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const streak = state.lastLogin === yesterday ? state.loginStreak + 1 : 1
  const reward = Math.min(10 + (streak - 1) * 5, 30)
  set({ donuts: state.donuts + reward, lastLogin: today, loginStreak: streak })
  showToast(`Chào mừng trở lại! Ngày ${streak} liên tiếp +${reward} 🍩`)
}
