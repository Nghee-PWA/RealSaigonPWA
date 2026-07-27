// ============================================================
// LẤY VỊ TRÍ "KHI CẦN" (tiết kiệm pin)
//
// KHÔNG theo dõi GPS chạy nền. Chỉ bật GPS đúng lúc người chơi
// cần (mở một địa điểm để check-in), đo một phát rồi tắt.
//
// - Trình duyệt tự NHỚ quyền → sau lần đầu KHÔNG hỏi phép lại.
// - Có nhớ kết quả gần nhất: nếu vừa đo cách đây chưa lâu thì trả
//   lại tức thì, KHÔNG bật GPS lần nữa → không hao pin, không nóng.
// ============================================================

let last = null // { lat, lng, accuracy, at }
let status = 'idle' // idle | locating | ok | denied | error | unsupported
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

export const subscribeGeo = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
export const getLastPosition = () => last
export const getGeoStatus = () => status

// Đo vị trí MỘT LẦN. Nếu đã có kết quả mới hơn maxAgeMs thì dùng lại
// ngay (không bật GPS). timeout để không "quay" mãi nếu bắt sóng kém.
export function locate({ maxAgeMs = 60000 } = {}) {
  return new Promise((resolve) => {
    if (last && Date.now() - last.at <= maxAgeMs) { resolve(last); return }
    if (!('geolocation' in navigator)) { status = 'unsupported'; emit(); resolve(null); return }
    status = 'locating'; emit()
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        last = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, at: Date.now() }
        status = 'ok'; emit(); resolve(last)
      },
      (err) => {
        status = err.code === err.PERMISSION_DENIED ? 'denied' : 'error'
        emit(); resolve(null)
      },
      { enableHighAccuracy: true, maximumAge: maxAgeMs, timeout: 20000 }
    )
  })
}

// Khoảng cách (mét) giữa 2 tọa độ — công thức haversine
export function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}
