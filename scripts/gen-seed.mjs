// Sinh supabase/seed.sql từ items.js + store.js.
// Nhờ vậy giá đồ / phần thưởng ở APP và ở MÁY CHỦ luôn là một.
// Chạy: npm run seed  (chạy lại mỗi khi đổi giá/địa điểm/nhiệm vụ)
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { ITEMS, OUTFIT_SETS } = await import('file://' + join(root, 'src/data/items.js').replaceAll('\\', '/'))
const { LOCATIONS, MISSIONS } = await import('file://' + join(root, 'src/data/store.js').replaceAll('\\', '/'))

const q = (s) => `'${String(s).replaceAll("'", "''")}'`
const arr = (a) => `array[${a.map(q).join(', ')}]`

const lines = ['-- TỰ SINH từ items.js + store.js — đừng sửa tay. Chạy lại: npm run seed', '']

lines.push('delete from catalog_items;')
for (const i of ITEMS) lines.push(`insert into catalog_items (id, slot, name, price) values (${q(i.id)}, ${q(i.slot)}, ${q(i.name)}, ${i.price});`)

lines.push('', 'delete from catalog_sets;')
for (const s of OUTFIT_SETS) lines.push(`insert into catalog_sets (id, name, price, items) values (${q(s.id)}, ${q(s.name)}, ${s.price}, ${arr(s.items)});`)

lines.push('', 'delete from catalog_locations;')
for (const l of LOCATIONS) lines.push(`insert into catalog_locations (id, name, lat, lng, reward) values (${q(l.id)}, ${q(l.name)}, ${l.lat}, ${l.lng}, ${l.reward});`)

lines.push('', 'delete from catalog_missions;')
for (const m of MISSIONS) lines.push(`insert into catalog_missions (id, name, reward, goal) values (${q(m.id)}, ${q(m.name)}, ${m.reward}, ${m.goal});`)

lines.push('')
writeFileSync(join(root, 'supabase/seed.sql'), lines.join('\n'))
console.log(`Đã sinh supabase/seed.sql: ${ITEMS.length} đồ, ${OUTFIT_SETS.length} set, ${LOCATIONS.length} địa điểm, ${MISSIONS.length} nhiệm vụ`)
