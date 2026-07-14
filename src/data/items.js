// ============================================================
// TỦ ĐỒ CỦA GAME — mọi món tùy biến nhân vật nằm ở đây.
//
// Nhân vật được vẽ trên lưới 24x24 ô. Mỗi món đồ là một "lớp"
// (layer) đè lên thân nhân vật: { y: hàng bắt đầu, rows: các dòng
// pixel, map: ký tự → mã màu }. Dấu chấm (.) = trong suốt.
//
// Khi có art direction chính thức (file ảnh/palette), chỉ cần
// thay các lưới và mã màu trong file này — game không phải sửa
// chỗ nào khác.
// ============================================================

// ---- Các ô trang bị trên người ----
// Tất cả đều tháo ra được: nhân vật gốc là "vanilla" hoàn toàn.
export const SLOTS = [
  { id: 'shirt', name: 'Áo', removable: true },
  { id: 'pants', name: 'Quần', removable: true },
  { id: 'hat', name: 'Mũ', removable: true },
  { id: 'glasses', name: 'Kính', removable: true },
  { id: 'hair', name: 'Tóc', removable: true },
  { id: 'bg', name: 'Nền', removable: true },
  { id: 'accL', name: 'Tay trái', removable: true },
  { id: 'accR', name: 'Tay phải', removable: true },
]

// ---- Khuôn hình dùng chung cho từng loại đồ (ôm theo thân tròn) ----
const SHIRT = {
  y: 14,
  rows: [
    '..AAAAAAAAAAAAAAAAAAAA..',
    '..AAAAAAAAAAAAAAAAAAAA..',
    '..AAAAAAAAAAAAAAAAAAAA..',
    '..AAAAAAAAAAAAAAAAAAAA..',
    '...aaaaaaaaaaaaaaaaaa...',
  ],
}

// Áo dài: như áo thường nhưng phủ xuống dưới
const SHIRT_LONG = {
  y: 14,
  rows: [...SHIRT.rows, '....AAAAAAAAAAAAAAAA....', '.....aAAAAAAAAAAAAa.....'],
}

const PANTS = {
  y: 19,
  rows: [
    '....PPPPPPPPPPPPPPPP....',
    '.....PPPPPPPPPPPPPP.....',
    '......pPPPp..pPPPp......',
  ],
}

const SHORTS = {
  y: 19,
  rows: ['....PPPPPPPPPPPPPPPP....', '.....PPPPPPPPPPPPPP.....'],
}

const HAIR_SHORT = {
  y: 3,
  rows: [
    '........HHHHHHHH........',
    '......HHHHHHHHHHHH......',
    '.....HH..........HH.....',
  ],
}

const HAIR_LONG = {
  y: 3,
  rows: [
    '........HHHHHHHH........',
    '......HHHHHHHHHHHH......',
    '.....HHH........HHH.....',
    '....HHH..........HHH....',
    '....HH............HH....',
    '...HHH............HHH...',
    '...HH..............HH...',
    '...HH..............HH...',
  ],
}

const NON_LA = {
  y: 0,
  rows: [
    '...........NN...........',
    '..........NNNN..........',
    '.........NNNNNN.........',
    '........nnnnnnnn........',
    '.....nnnnnnnnnnnnnn.....',
  ],
}

const CAP = {
  y: 2,
  rows: [
    '.......KKKKKKKKKK.......',
    '......KKKKKKKKKKKK......',
    '......kkkkkkkkkkkkkkk...',
  ],
}

const CROWN = {
  y: 1,
  rows: [
    '........G.G..G.G........',
    '........GGGGGGGG........',
    '........GJGGGGJG........',
  ],
}

const SHADES = {
  y: 9,
  rows: ['....DDDDDDDDDDDDDDDD....', '....DDDDDDDDDDDDDDDD....'],
}

const ROUND_GLASSES = {
  y: 9,
  rows: ['......RRR..RR..RRR......', '......RRR......RRR......'],
}

const BALLOON = {
  y: 9,
  rows: [
    '.BBB....................',
    '.BBB....................',
    '..b.....................',
    '..b.....................',
    '..b.....................',
  ],
}

const BANH_MI = {
  y: 15,
  rows: ['WWWWWW..................', 'WwwwwW..................'],
}

const COFFEE = {
  y: 11,
  rows: [
    '.....................u..',
    '....................UUU.',
    '....................UUU.',
    '....................uuu.',
  ],
}

const FLAG = {
  y: 7,
  rows: [
    '....................FFFF',
    '....................FYFF',
    '....................FFFF',
    '....................o...',
    '....................o...',
    '....................o...',
  ],
}

// ---- Danh mục món đồ ----
export const ITEMS = [
  // Nền (bgDef: trời + đất + chi tiết trang trí [cột, hàng, màu])
  { id: 'bg-mint', slot: 'bg', name: 'Nền bạc hà', price: 30, bgDef: { sky: '#c8ece2', ground: '#a8dcb5', deco: [] } },
  { id: 'bg-sunset', slot: 'bg', name: 'Hoàng hôn Sài Gòn', price: 40, bgDef: { sky: '#ffb36b', ground: '#e2725b', deco: [[17, 3, '#ffe066'], [18, 3, '#ffe066'], [17, 4, '#ffe066'], [18, 4, '#ffe066']] } },
  { id: 'bg-night', slot: 'bg', name: 'Đêm thành phố', price: 60, bgDef: { sky: '#2b3a67', ground: '#1d2b4f', deco: [[3, 2, '#ffe066'], [8, 1, '#ffffff'], [15, 5, '#ffe066'], [20, 2, '#ffffff'], [5, 6, '#ffffff']] } },

  // Tóc
  { id: 'hair-short-brown', slot: 'hair', name: 'Tóc nâu', price: 25, layer: { ...HAIR_SHORT, map: { H: '#5b3a29' } } },
  { id: 'hair-short-pink', slot: 'hair', name: 'Tóc hồng', price: 30, layer: { ...HAIR_SHORT, map: { H: '#f2617a' } } },
  { id: 'hair-long-black', slot: 'hair', name: 'Tóc dài đen', price: 50, layer: { ...HAIR_LONG, map: { H: '#2b1d14' } } },

  // Áo
  { id: 'shirt-pink', slot: 'shirt', name: 'Áo hồng', price: 20, layer: { ...SHIRT, map: { A: '#f2617a', a: '#d14e66' } } },
  { id: 'shirt-blue', slot: 'shirt', name: 'Áo xanh biển', price: 30, layer: { ...SHIRT, map: { A: '#3aa7d9', a: '#2f8ab3' } } },
  { id: 'shirt-green', slot: 'shirt', name: 'Áo xanh lá', price: 30, layer: { ...SHIRT, map: { A: '#5cb85c', a: '#4a9a4a' } } },
  { id: 'ao-dai-red', slot: 'shirt', name: 'Áo dài đỏ', price: 80, layer: { ...SHIRT_LONG, map: { A: '#d9534f', a: '#b83e3b' } } },
  { id: 'shirt-gold', slot: 'shirt', name: 'Áo hoàng kim', price: 100, layer: { ...SHIRT, map: { A: '#f2c14e', a: '#d99e2b' } } },

  // Quần
  { id: 'pants-brown', slot: 'pants', name: 'Quần nâu', price: 20, layer: { ...PANTS, map: { P: '#8a5a3b', p: '#6f4730' } } },
  { id: 'pants-blue', slot: 'pants', name: 'Quần jean', price: 30, layer: { ...PANTS, map: { P: '#3f6fb5', p: '#325a93' } } },
  { id: 'shorts-green', slot: 'pants', name: 'Quần short', price: 35, layer: { ...SHORTS, map: { P: '#5cb85c' } } },

  // Mũ
  { id: 'non-la', slot: 'hat', name: 'Nón lá', price: 40, layer: { ...NON_LA, map: { N: '#f2c14e', n: '#d99e2b' } } },
  { id: 'cap-blue', slot: 'hat', name: 'Mũ lưỡi trai', price: 35, layer: { ...CAP, map: { K: '#3aa7d9', k: '#2f8ab3' } } },
  { id: 'crown', slot: 'hat', name: 'Vương miện', price: 150, layer: { ...CROWN, map: { G: '#f2c14e', J: '#e05c76' } } },

  // Kính
  { id: 'shades', slot: 'glasses', name: 'Kính đen', price: 45, layer: { ...SHADES, map: { D: '#2b2b2b' } } },
  { id: 'round-glasses', slot: 'glasses', name: 'Kính tròn', price: 35, layer: { ...ROUND_GLASSES, map: { R: '#7fd1e8' } } },

  // Phụ kiện tay trái
  { id: 'balloon', slot: 'accL', name: 'Bóng bay', price: 25, layer: { ...BALLOON, map: { B: '#f2617a', b: '#9a8c7e' } } },
  { id: 'banh-mi', slot: 'accL', name: 'Bánh mì', price: 30, layer: { ...BANH_MI, map: { W: '#d99e2b', w: '#ffe0b8' } } },

  // Phụ kiện tay phải
  { id: 'coffee', slot: 'accR', name: 'Cà phê sữa đá', price: 25, layer: { ...COFFEE, map: { U: '#8a5a3b', u: '#e8e4d8' } } },
  { id: 'flag', slot: 'accR', name: 'Cờ đỏ sao vàng', price: 35, layer: { ...FLAG, map: { F: '#d9534f', Y: '#f2c14e', o: '#8a5a3b' } } },
]

export const itemById = (id) => ITEMS.find((i) => i.id === id) || null

// ---- Set outfit: mua 1 lần được cả bộ (rẻ hơn mua lẻ) ----
export const OUTFIT_SETS = [
  { id: 'set-du-khach', name: 'Set Du khách', price: 110, items: ['cap-blue', 'shades', 'shirt-blue', 'pants-blue'] },
  { id: 'set-sai-gon', name: 'Set Sài Gòn', price: 130, items: ['non-la', 'ao-dai-red', 'flag'] },
  { id: 'set-hoang-gia', name: 'Set Hoàng gia', price: 220, items: ['crown', 'shirt-gold', 'bg-night'] },
]

export const setById = (id) => OUTFIT_SETS.find((s) => s.id === id) || null

// Nhân vật khởi đầu: vanilla 100% — không tóc, không đồ, không nền.
// Mọi cá tính đều do người chơi tự sắm và mặc vào.
export const DEFAULT_OUTFIT = {
  bg: null,
  hair: null,
  shirt: null,
  pants: null,
  hat: null,
  glasses: null,
  accL: null,
  accR: null,
}
