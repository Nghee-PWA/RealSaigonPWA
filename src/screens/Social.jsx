import Avatar from '../components/Avatar.jsx'
import { addDemoFriend, showToast } from '../data/backend.js'
import { itemById, SLOTS } from '../data/items.js'

function timeAgo(at) {
  const mins = Math.round((Date.now() - at) / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  return `${Math.round(hours / 24)} ngày trước`
}

function outfitSummary(outfit) {
  return SLOTS.map((s) => outfit[s.id] && itemById(outfit[s.id])?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(', ')
}

export default function Social({ state }) {
  return (
    <div className="screen">
      <h2>Social</h2>
      <p className="muted">
        Bản demo dùng bạn bè "ảo". Khi nối Supabase, đây sẽ là người chơi thật và
        bạn thấy họ thay đồ gần như ngay lập tức.
      </p>
      <button className="btn" onClick={addDemoFriend}>➕ Thêm bạn (demo)</button>

      {state.friends.map((f) => (
        <div key={f.id} className="card loc-row">
          <Avatar outfit={f.outfit} size={64} />
          <span className="loc-info">
            <b>{f.name}</b>
            <small className="muted">Đang mặc: {outfitSummary(f.outfit)}</small>
          </span>
          <button className="btn btn-sm" onClick={() => showToast(`Đã rung chuông gọi ${f.name} đi chơi! 🔔`)}>
            🔔
          </button>
        </div>
      ))}

      <h3>Bảng tin</h3>
      {state.posts.length === 0 && <p className="muted">Chưa có hoạt động nào. Đi check-in thôi!</p>}
      {state.posts.map((p) => (
        <div key={p.id} className="card">
          {p.type === 'photo' ? (
            <>
              <b>{p.who}</b> đã check-in tại <b>{p.locName}</b>
              {p.photo && <img className="photo" src={p.photo} alt={p.locName} />}
            </>
          ) : (
            <>
              <b>{p.who}</b> vừa diện <b>{p.itemName}</b> ✨
            </>
          )}
          <div><small className="muted">{timeAgo(p.at)}</small></div>
        </div>
      ))}
    </div>
  )
}
