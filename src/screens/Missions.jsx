import { useState } from 'react'
import { LOCATIONS, MISSIONS, checkIn, claimMission } from '../data/backend.js'

const CHECKIN_RADIUS_M = 350 // được phép check-in khi ở trong bán kính này

function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Nén ảnh trước khi lưu: thu nhỏ về tối đa 900px, chất lượng 70%.
// Sau này ảnh sẽ up lên kho ảnh Supabase thay vì lưu trên máy.
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
  const [geo, setGeo] = useState({ status: 'idle' }) // idle | checking | near | far | error
  const [photo, setPhoto] = useState(null)

  const openLocation = (loc) => {
    setSelected(loc)
    setGeo({ status: 'idle' })
    setPhoto(null)
  }

  const verifyPosition = () => {
    setGeo({ status: 'checking' })
    if (!navigator.geolocation) {
      setGeo({ status: 'error', msg: 'Thiết bị không hỗ trợ định vị' })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = distanceMeters(pos.coords.latitude, pos.coords.longitude, selected.lat, selected.lng)
        setGeo(d <= CHECKIN_RADIUS_M ? { status: 'near' } : { status: 'far', distance: d })
      },
      () => setGeo({ status: 'error', msg: 'Không lấy được vị trí — hãy cho phép truy cập vị trí' }),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(await compressPhoto(file))
  }

  const confirmCheckIn = () => {
    checkIn(selected.id, photo)
    setSelected(null)
  }

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
        ) : geo.status !== 'near' ? (
          <div className="card center">
            <p>Bước 1: đến nơi và xác nhận vị trí</p>
            <button className="btn" onClick={verifyPosition} disabled={geo.status === 'checking'}>
              {geo.status === 'checking' ? 'Đang định vị…' : '📍 Tôi đã đến nơi!'}
            </button>
            {geo.status === 'far' && (
              <p className="muted">Bạn còn cách {Math.round(geo.distance)}m. Đến gần hơn nhé!</p>
            )}
            {geo.status === 'error' && <p className="muted">{geo.msg}</p>}
            {(geo.status === 'far' || geo.status === 'error') && (
              <button className="btn-ghost" onClick={() => setGeo({ status: 'near' })}>
                🧪 Giả lập vị trí (chỉ để thử nghiệm)
              </button>
            )}
          </div>
        ) : (
          <div className="card center">
            <p>Bước 2: chụp một tấm ảnh tại đây!</p>
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
      {LOCATIONS.map((loc) => (
        <button key={loc.id} className="card loc-row" onClick={() => openLocation(loc)}>
          <span className="loc-icon">{state.visited[loc.id] ? '✅' : '📍'}</span>
          <span className="loc-info">
            <b>{loc.name}</b>
            <small className="muted">{loc.desc}</small>
          </span>
          <span className="reward">+{loc.reward}🍩</span>
        </button>
      ))}

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
