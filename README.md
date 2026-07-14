# NNN — Khám phá Sài Gòn (PWA)

Game PWA phong cách pixel: đến địa điểm nổi tiếng ở Sài Gòn, check-in bằng GPS,
chụp ảnh nhận 🍩, sắm trang phục cho nhân vật và khoe với bạn bè.

📖 **Chưa rành kỹ thuật? Đọc [HA-TANG.md](HA-TANG.md)** — giải thích toàn bộ hạ
tầng (GitHub, Vercel, Supabase, PWA...) bằng ngôn ngữ đời thường.

## Chạy trên máy

```bash
npm install       # cài thư viện (chỉ cần lần đầu)
npm run dev       # mở game tại http://localhost:5173
```

## Các lệnh khác

```bash
npm run build     # đóng gói bản phát hành (ra thư mục dist/)
npm run preview   # chạy thử bản đã đóng gói
npm run icons     # tạo lại icon app từ scripts/generate-icons.mjs
```

## Cấu trúc

```
index.html                  Trang gốc
vite.config.js              Cấu hình build + manifest PWA
scripts/generate-icons.mjs  Tạo icon PNG pixel-art
src/
  main.jsx                  Điểm khởi động + đăng ký service worker
  App.jsx                   Khung app + 5 tab: Store, Social, Profile, Nhiệm vụ, Diary
  styles.css                Giao diện pixel
  data/items.js             ⭐ Tủ đồ: áo/quần/mũ/kính/tóc/nền/phụ kiện + set outfit
  data/store.js             ⭐ Dữ liệu & luật chơi (nơi sẽ nối Supabase)
  components/Avatar.jsx     Nhân vật vanilla 24x24 + các lớp đồ đè lên
  screens/                  Store, Social, Profile, Missions (địa điểm+thử thách), Diary
```

## Trạng thái

Bản demo: dữ liệu lưu localStorage trên máy người chơi. Bước kế tiếp là nối
Supabase (auth ẩn danh + database + storage ảnh + realtime) — mọi điểm cần sửa
đều nằm trong `src/data/store.js`.
