import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import { addFriendByCode, reportPost, showToast } from '../data/backend.js'
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
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async () => {
    const c = code.trim()
    if (!c || sending) return
    setSending(true)
    await addFriendByCode(c)
    setSending(false)
    setCode('')
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(state.friendCode)
      showToast('Đã sao chép mã!')
    } catch {
      showToast('Mã của bạn: ' + state.friendCode)
    }
  }

  const report = (p) => {
    if (confirm('Báo cáo ảnh này là không phù hợp?')) reportPost(p.id)
  }

  return (
    <div className="screen">
      <h2>Social</h2>

      <div className="card center">
        <small className="muted">Mã kết bạn của bạn</small>
        <div className="friend-code">{state.friendCode || '· · · · · ·'}</div>
        <button className="btn btn-sm" onClick={copyCode} disabled={!state.friendCode}>
          📋 Sao chép mã
        </button>
      </div>

      <div className="card">
        <b>Kết bạn</b>
        <p className="muted">Nhập mã của bạn bè (họ xem mã trong tab Social trên máy họ)</p>
        <div className="friend-form">
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VD: AB2C3D"
            maxLength={8}
          />
          <button className="btn btn-sm" onClick={submit} disabled={!code.trim() || sending}>
            {sending ? '...' : 'Kết bạn'}
          </button>
        </div>
      </div>

      {state.friends.map((f) => (
        <div key={f.id} className="card loc-row">
          <Avatar outfit={f.outfit} size={64} />
          <span className="loc-info">
            <b>{f.name}</b>
            <small className="muted">Đang mặc: {outfitSummary(f.outfit) || 'vanilla nguyên bản'}</small>
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
          ) : p.type === 'friend' ? (
            <>
              <b>{p.who}</b> đã kết bạn với <b>{p.friendName}</b> 🤝
            </>
          ) : (
            <>
              <b>{p.who}</b> vừa diện <b>{p.itemName}</b> ✨
            </>
          )}
          <div className="post-foot">
            <small className="muted">{timeAgo(p.at)}</small>
            {p.type === 'photo' && p.photo && p.who !== 'Bạn' && (
              <button className="btn-ghost report" onClick={() => report(p)}>⚠️ Báo cáo</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
