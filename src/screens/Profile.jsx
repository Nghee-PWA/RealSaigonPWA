import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import { LOCATIONS, MISSIONS, resetGame } from '../data/backend.js'
import { SLOTS, itemById } from '../data/items.js'
import FittingRoom from './FittingRoom.jsx'

export default function Profile({ state }) {
  const [fitting, setFitting] = useState(false)
  const visitedCount = Object.keys(state.visited).length
  const missionsDone = MISSIONS.filter((m) => m.progress(state) >= m.goal).length
  const wearing = SLOTS.map((s) => state.equipped[s.id] && itemById(state.equipped[s.id])?.name).filter(Boolean)

  if (fitting) return <FittingRoom state={state} onClose={() => setFitting(false)} />

  return (
    <div className="screen">
      <div className="card center">
        <Avatar outfit={state.equipped} size={220} />
        <h2>Bé Na</h2>
        <p className="muted">{wearing.length ? wearing.join(' · ') : 'Vanilla nguyên bản — vào Store sắm đồ nào!'}</p>
        <button className="btn" onClick={() => setFitting(true)}>👗 Phòng thử đồ</button>
      </div>

      <div className="stat-row">
        <div className="card stat">
          <div className="stat-num">{visitedCount}/{LOCATIONS.length}</div>
          <div className="stat-label">Địa điểm</div>
        </div>
        <div className="card stat">
          <div className="stat-num">{missionsDone}/{MISSIONS.length}</div>
          <div className="stat-label">Nhiệm vụ</div>
        </div>
        <div className="card stat">
          <div className="stat-num">{state.friends.length}</div>
          <div className="stat-label">Bạn bè</div>
        </div>
      </div>

      <div className="card">
        <h3>Chơi thế nào?</h3>
        <p>Đi đến các địa điểm nổi tiếng ở Sài Gòn, check-in và chụp ảnh để nhận 🍩. Dùng 🍩 sắm đồ cho Bé Na, rồi khoe với bạn bè!</p>
      </div>

      <button className="btn-ghost" onClick={() => { if (confirm('Xóa toàn bộ tiến trình và chơi lại từ đầu?')) resetGame() }}>
        Chơi lại từ đầu
      </button>
    </div>
  )
}
