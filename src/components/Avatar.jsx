// Nhân vật của game — một "cục tròn" vanilla màu kem (kiểu Charlie/Molang):
// mắt chấm, má ửng nhẹ, không tóc, không đồ. Mọi cá tính đến từ items.js,
// đè lên theo từng lớp: nền → thân → quần → áo → tóc → kính → mũ → phụ kiện.
import { itemById } from '../data/items.js'

const BODY = {
  y: 3,
  rows: [
    '........OOOOOOOO........',
    '......OOSSSSSSSSOO......',
    '.....OSSSSSSSSSSSSO.....',
    '....OSSSSSSSSSSSSSSO....',
    '....OSSSSSSSSSSSSSSO....',
    '...OSSSSSSSSSSSSSSSSO...',
    '...OSSSESSSSSSSSESSSO...',
    '...OSSSESSSSSSSSESSSO...',
    '...OSCCSSSSSSSSSSCCSO...',
    '...OSSSSSSSMMSSSSSSSO...',
    '...OSSSSSSSSSSSSSSSSO...',
    '..OOSSSSSSSSSSSSSSSSOO..',
    '..OSSSSSSSSSSSSSSSSSSO..',
    '..OSSSSSSSSSSSSSSSSSSO..',
    '..OOSSSSSSSSSSSSSSSSOO..',
    '...OSSSSSSSSSSSSSSSSO...',
    '....OSSSSSSSSSSSSSSO....',
    '.....OSSSSSSSSSSSSO.....',
    '......OSSSO..OSSSO......',
    '......OOOOO..OOOOO......',
  ],
  map: {
    O: '#4a3728', // viền
    S: '#f7f1e6', // thân kem trắng — trung tính, không "màu da người"
    E: '#3b2d23', // mắt chấm
    C: '#f6cfc9', // má ửng rất nhẹ
    M: '#d89a8f', // miệng nhỏ
  },
}

function LayerRects({ layer }) {
  return layer.rows.flatMap((row, dy) =>
    [...row].map((c, x) =>
      c === '.' ? null : (
        <rect key={`${x}-${layer.y + dy}`} x={x} y={layer.y + dy} width="1" height="1" fill={layer.map[c]} />
      )
    )
  )
}

const LAYER_ORDER = ['pants', 'shirt', 'hair', 'glasses', 'hat', 'accL', 'accR']

export default function Avatar({ outfit, size = 120 }) {
  const bg = outfit.bg ? itemById(outfit.bg)?.bgDef : null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges" aria-label="Nhân vật">
      {bg && (
        <>
          <rect x="0" y="0" width="24" height="17" fill={bg.sky} />
          <rect x="0" y="17" width="24" height="7" fill={bg.ground} />
          {bg.deco.map(([x, y, color]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
          ))}
        </>
      )}
      <LayerRects layer={BODY} />
      {LAYER_ORDER.map((slot) => {
        const item = outfit[slot] ? itemById(outfit[slot]) : null
        return item?.layer ? <LayerRects key={slot} layer={item.layer} /> : null
      })}
    </svg>
  )
}
