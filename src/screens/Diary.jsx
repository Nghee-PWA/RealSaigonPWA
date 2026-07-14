import { LOCATIONS } from '../data/backend.js'

// The Saigon Diary — cuốn nhật ký ảnh: mỗi lần check-in có chụp
// ảnh sẽ thêm một trang kỷ niệm vào đây.
export default function Diary({ state }) {
  const pages = Object.entries(state.visited)
    .filter(([, v]) => v.photo)
    .map(([locId, v]) => ({ loc: LOCATIONS.find((l) => l.id === locId), ...v }))
    .sort((a, b) => b.at - a.at)

  return (
    <div className="screen">
      <h2>The Saigon Diary</h2>
      <p className="muted">Những khoảnh khắc bạn đã lưu lại trên hành trình khám phá Sài Gòn</p>

      {pages.length === 0 ? (
        <div className="card center">
          <p>📖 Cuốn nhật ký còn trống.</p>
          <p className="muted">Vào tab Nhiệm vụ, đến một địa điểm và chụp tấm ảnh đầu tiên nhé!</p>
        </div>
      ) : (
        <div className="diary-grid">
          {pages.map((p) => (
            <div key={p.loc.id} className="card polaroid">
              <img className="photo" src={p.photo} alt={p.loc.name} />
              <b>{p.loc.name}</b>
              <small className="muted">{new Date(p.at).toLocaleDateString('vi-VN')}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
