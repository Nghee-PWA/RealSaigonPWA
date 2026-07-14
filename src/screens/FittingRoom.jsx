import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import { SLOTS, ITEMS } from '../data/items.js'
import { setOutfit } from '../data/backend.js'

// Phòng thử đồ: phối tự do mọi món ĐÃ SỞ HỮU, xem trước tức thì
// (không gọi máy chủ khi đang thử), chỉ lưu khi bấm "Mặc bộ này".
export default function FittingRoom({ state, onClose }) {
  const [draft, setDraft] = useState(() => ({ ...state.equipped }))
  const [slot, setSlot] = useState('shirt')

  const ownedInSlot = (s) => ITEMS.filter((i) => i.slot === s && state.ownedItems.includes(i.id))
  const current = SLOTS.find((s) => s.id === slot)
  const items = ownedInSlot(slot)

  const pick = (id) => setDraft({ ...draft, [slot]: id })

  const randomize = () => {
    const next = {}
    for (const s of SLOTS) {
      const owned = ownedInSlot(s.id)
      if (owned.length === 0) { next[s.id] = null; continue }
      // ô tháo được: thỉnh thoảng để trống cho tự nhiên
      if (s.removable && Math.random() < 0.3) { next[s.id] = null; continue }
      next[s.id] = owned[Math.floor(Math.random() * owned.length)].id
    }
    setDraft(next)
  }

  const save = () => { setOutfit(draft); onClose() }

  const dirty = SLOTS.some((s) => (draft[s.id] || null) !== (state.equipped[s.id] || null))

  return (
    <div className="fitting">
      <div className="fitting-head">
        <button className="btn-ghost" onClick={onClose}>← Đóng</button>
        <b>Phòng thử đồ</b>
        <button className="btn-ghost" onClick={randomize}>🎲 Ngẫu nhiên</button>
      </div>

      <div className="fitting-preview">
        <Avatar outfit={draft} size={200} />
      </div>

      <div className="chips">
        {SLOTS.map((s) => (
          <button key={s.id} className={slot === s.id ? 'chip active' : 'chip'} onClick={() => setSlot(s.id)}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="fitting-items">
        {current.removable && (
          <button className={!draft[slot] ? 'card center fit-item on' : 'card center fit-item'} onClick={() => pick(null)}>
            <span className="fit-none">🚫</span>
            <small>Bỏ trống</small>
          </button>
        )}
        {items.length === 0 && !current.removable && (
          <p className="muted">Chưa có "{current.name.toLowerCase()}" nào. Mua thêm ở Store nhé!</p>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            className={draft[slot] === item.id ? 'card center fit-item on' : 'card center fit-item'}
            onClick={() => pick(item.id)}
          >
            <Avatar outfit={{ [item.slot]: item.id }} size={64} />
            <small>{item.name}</small>
          </button>
        ))}
      </div>

      <div className="fitting-actions">
        <button className="btn" onClick={save} disabled={!dirty}>Mặc bộ này</button>
      </div>
    </div>
  )
}
