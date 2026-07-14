import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'
import { SLOTS, ITEMS, OUTFIT_SETS, itemById } from '../data/items.js'
import { buyItem, equipItem, unequipSlot, buySet } from '../data/backend.js'

const CATS = [{ id: 'sets', name: '✨ Set' }, ...SLOTS]

export default function Store({ state }) {
  const [cat, setCat] = useState('shirt')
  const slot = SLOTS.find((s) => s.id === cat)

  // Xem trước: nhân vật đang mặc đồ hiện tại + món đang xem
  const tryOn = (patch) => ({ ...state.equipped, ...patch })

  return (
    <div className="screen">
      <h2>Store</h2>
      <p className="muted">Sắm đồ cho Bé Na bằng 🍩 kiếm được</p>

      <div className="chips">
        {CATS.map((c) => (
          <button key={c.id} className={cat === c.id ? 'chip active' : 'chip'} onClick={() => setCat(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      {cat === 'sets' ? (
        <div className="shop-grid">
          {OUTFIT_SETS.map((s) => {
            const patch = {}
            for (const id of s.items) patch[itemById(id).slot] = id
            const ownedAll = s.items.every((id) => state.ownedItems.includes(id))
            return (
              <div key={s.id} className="card center">
                <Avatar outfit={tryOn(patch)} size={96} />
                <b>{s.name}</b>
                <small className="muted">{s.items.map((id) => itemById(id).name).join(' + ')}</small>
                {ownedAll ? (
                  <small>✅ Đã sở hữu cả bộ</small>
                ) : (
                  <button className="btn btn-sm" disabled={state.donuts < s.price} onClick={() => buySet(s.id)}>
                    {s.price} 🍩
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <>
          {slot.removable && state.equipped[cat] && (
            <button className="btn-ghost" onClick={() => unequipSlot(cat)}>Tháo {slot.name.toLowerCase()} ra</button>
          )}
          <div className="shop-grid">
            {ITEMS.filter((i) => i.slot === cat).map((item) => {
              const owned = state.ownedItems.includes(item.id)
              const equipped = state.equipped[cat] === item.id
              return (
                <div key={item.id} className="card center">
                  <Avatar outfit={tryOn({ [cat]: item.id })} size={96} />
                  <b>{item.name}</b>
                  {equipped ? (
                    <small>✨ Đang dùng</small>
                  ) : owned ? (
                    <button className="btn btn-sm" onClick={() => equipItem(item.id)}>Mặc</button>
                  ) : (
                    <button className="btn btn-sm" disabled={state.donuts < item.price} onClick={() => buyItem(item.id)}>
                      {item.price} 🍩
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
