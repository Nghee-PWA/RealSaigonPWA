// ============================================================
// THEO DÕI VỊ TRÍ "SỐNG"
//
// Xin quyền vị trí MỘT LẦN mỗi session, rồi cập nhật vị trí liên
// tục trong nền (watchPosition) khi người chơi di chuyển. Nhờ vậy
// đến địa điểm mới không phải xin phép lại, cũng không phải chờ
// "đang định vị" — app đã biết sẵn vị trí mới nhất.
// ============================================================

let watchId = null
let last = null // { lat, lng, accuracy, at }
let status = 'idle' // idle | watching | denied | unsupported
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

export const subscribeGeo = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
export const getLastPosition = () => last
export const getGeoStatus = () => status

// Gọi một lần (vd khi vào tab Nhiệm vụ). Lần đầu sẽ bật popup xin
// phép; các lần sau không làm gì nếu đã đang theo dõi.
export function startGeo() {
  if (watchId !== null) return
  if (!('geolocation' in navigator)) { status = 'unsupported'; emit(); return }
  status = 'watching'; emit()
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      last = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, at: Date.now() }
      status = 'watching'
      emit()
    },
    (err) => {
      if (err.code === err.PERMISSION_DENIED) status = 'denied'
      emit()
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 25000 }
  )
}

export function stopGeo() {
  if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null }
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
