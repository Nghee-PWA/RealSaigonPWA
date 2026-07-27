import { useState, useSyncExternalStore } from 'react'
import { LOCATIONS, MISSIONS, checkIn, claimMission } from '../data/backend.js'
import { locate, subscribeGeo, getLastPosition, getGeoStatus, distanceMeters } from '../data/geo.js'

const CHECKIN_RADIUS_M = 350 // được phép check-in khi ở trong bán kính này

// Nén ảnh trước khi lưu: thu nhỏ về tối đa 900px, chất lượng 70%.
function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, 900 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(img.src)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export default function Missions({ state }) {
  const [selected, setSelected] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [simulated, setSimulated] = useState(false) // nút thử nghiệm

  // Vị trí "khi cần": chỉ đo lúc mở địa điểm, không chạy nền
  const pos = useSyncExternalStore(subscribeGeo, getLastPosition)
  const geoStatus = useSyncExternalStore(subscribeGeo, getGeoStatus)

  const openLocation = (loc) => {
    setSelected(loc)
    setPhoto(null)
    setSimulated(false)
    locate() // đo 1 lần (dùng lại kết quả gần đây nếu có → khỏi bật GPS)
  }

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(await compressPhoto(file))
  }

  const confirmCheckIn = () => {
    checkIn(selected.id, photo)
    setSelected(null)
  }

  // Khoảng cách từ vị trí sống tới địa điểm đang xem (nếu đã có vị trí)
  const distance = selected && pos ? distanceMeters(pos.lat, pos.lng, selected.lat, selected.lng) : null
  const near = simulated || (distance !== null && distance <= CHECKIN_RADIUS_M)

  // ---- Màn hình chi tiết một địa điểm (luồng check-in) ----
  if (selected) {
    const done = state.visited[selected.id]
    return (
      <div className="screen">
        <button className="btn-ghost" onClick={() => setSelected(null)}>← Quay lại</button>
        <div className="card">
          <h2>{selected.name}</h2>
          <p>{selected.desc}</p>
          <p className="reward">Phần thưởng: +{selected.reward} 🍩</p>
        </div>

        {done ? (
          <div className="card center">
            <p>✅ Bạn đã check-in nơi này rồi!</p>
            {done.photo && <img className="photo" src={done.photo} alt={selected.name} />}
          </div>
        ) : near ? (
          // Đã tới nơi (tự nhận ra từ vị trí sống) → chụp ảnh luôn
          <div className="card center">
            <p>📍 Bạn đang ở đây! Chụp một tấm ảnh nào.</p>
            {photo ? (
              <>
                <img className="photo" src={photo} alt="Ảnh check-in" />
                <button className="btn" onClick={confirmCheckIn}>Đăng & nhận {selected.reward} 🍩</button>
              </>
            ) : (
              <label className="btn">
                📷 Chụp / chọn ảnh
                <input type="file" accept="image/*" capture="environment" hidden onChange={onPickPhoto} />
              </label>
            )}
          </div>
        ) : (
          // Chưa tới nơi — đo khi cần, KHÔNG chạy nền, KHÔNG hỏi lại quyền
          <div className="card center">
            {geoStatus === 'denied' ? (
              <p className="muted">Bạn đã từ chối quyền vị trí. Bật lại trong cài đặt trình duyệt để check-in.</p>
            ) : geoStatus === 'unsupported' ? (
              <p className="muted">Thiết bị không hỗ trợ định vị.</p>
            ) : geoStatus === 'locating' ? (
              <p className="muted">📡 Đang lấy vị trí của bạn…</p>
            ) : distance === null ? (
              <p className="muted">Bấm nút bên dưới để kiểm tra bạn đã tới nơi chưa.</p>
            ) : (
              <p className="muted">Bạn còn cách <b>{Math.round(distance)}m</b>. Tới nơi rồi thì bấm "Kiểm tra lại" nhé!</p>
            )}
            <button className="btn" onClick={() => locate({ maxAgeMs: 0 })} disabled={geoStatus === 'locating'}>
              📍 Tôi đã tới nơi — kiểm tra
            </button>
            <button className="btn-ghost" onClick={() => setSimulated(true)}>
              🧪 Giả lập vị trí (chỉ để thử nghiệm)
            </button>
          </div>
        )}
      </div>
    )
  }

  // ---- Danh sách: địa điểm cần đến + thử thách ----
  return (
    <div className="screen">
      <h2>Nhiệm vụ</h2>
      <h3>📍 Đi các nơi</h3>
      <p className="muted">Đến địa điểm, check-in bằng GPS, chụp ảnh nhận 🍩</p>
      {LOCATIONS.map((loc) => {
        const d = pos ? distanceMeters(pos.lat, pos.lng, loc.lat, loc.lng) : null
        return (
          <button key={loc.id} className="card loc-row" onClick={() => openLocation(loc)}>
            <span className="loc-icon">{state.visited[loc.id] ? '✅' : '📍'}</span>
            <span className="loc-info">
              <b>{loc.name}</b>
              <small className="muted">
                {d !== null && !state.visited[loc.id] ? `Cách bạn ~${d < 1000 ? Math.round(d) + 'm' : (d / 1000).toFixed(1) + 'km'}` : loc.desc}
              </small>
            </span>
            <span className="reward">+{loc.reward}🍩</span>
          </button>
        )
      })}

      <h3>🎯 Thử thách</h3>
      {MISSIONS.map((m) => {
        const progress = Math.min(m.progress(state), m.goal)
        const done = progress >= m.goal
        const claimed = state.claimed.includes(m.id)
        return (
          <div key={m.id} className="card">
            <div className="mission-head">
              <b>{m.name}</b>
              <span className="reward">+{m.reward}🍩</span>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${(progress / m.goal) * 100}%` }} />
            </div>
            <div className="mission-foot">
              <small className="muted">{progress}/{m.goal}</small>
              {claimed ? (
                <small>✅ Đã nhận</small>
              ) : done ? (
                <button className="btn btn-sm" onClick={() => claimMission(m.id)}>Nhận thưởng</button>
              ) : (
                <small className="muted">Chưa xong</small>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
