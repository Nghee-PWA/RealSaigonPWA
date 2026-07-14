# 🤝 BÀN GIAO CHO ĐỘI NGŨ — UI/UX · Skins · Gameplay

> Tài liệu này giúp đội của bạn cắm việc vào **mà không làm vỡ backend**. Đọc mục
> 1 trước để hiểu nguyên tắc vàng. Đội art đọc kỹ mục 3 **trước khi vẽ hàng loạt**.

---

## 1. Nguyên tắc vàng: TÁCH "BỘ MẶT" KHỎI "BỘ KHUNG"

Dự án có 2 tầng, đội chỉ làm tầng trên:

| Tầng | Gồm những gì | File | Được đụng? |
| --- | --- | --- | --- |
| 🎨 **Bộ mặt** | Giao diện, art, skins, màn hình, hoạt ảnh | `src/screens/*`, `src/components/*`, `src/styles.css` | ✅ Thoải mái thay |
| ⚙️ **Bộ khung** | Backend, database, chống gian lận, luồng dữ liệu | `src/data/supabase.js`, `src/data/backend.js`, `supabase/*` | ⛔ **KHÔNG đụng** |
| 🔗 **Mối nối** | Danh mục đồ, số kinh tế | `src/data/items.js`, phần đầu `src/data/store.js` | ✏️ Sửa theo quy tắc mục 2 |

**Vì sao art đổi thoải mái mà không lo vỡ backend:** backend chỉ biết **mã** món đồ
(`shirt-pink`) và **giá** (20 🍩). Nó không biết món đó trông thế nào. Đội art đổi
hình, đổi phong cách, đổi kích thước — backend không hề hay biết và vẫn chạy đúng.

---

## 2. Mối nối: thêm/sửa nội dung thế nào

### Thêm một món đồ (skin, phụ kiện)
1. Thêm một dòng vào `src/data/items.js`: `{ id, slot, name, price, ... }`
   - `id`: mã duy nhất, viết-thường-gạch-nối (vd `hat-santa`). **Đổi id = mất đồ của người đã mua** → đặt xong đừng đổi.
   - `slot`: một trong 8 ô — `shirt, pants, hat, glasses, hair, bg, accL, accR`
   - `price`: giá bằng 🍩
2. Chạy `npm run seed` → sinh lại `supabase/seed.sql`
3. Chạy `seed.sql` mới trên Supabase (SQL Editor) để máy chủ biết giá món mới

> ⚠️ Giá phải khớp 2 nơi (app ↔ máy chủ). `npm run seed` lo việc đó tự động —
> **luôn chạy nó sau khi đổi giá/đồ**, nếu không máy chủ sẽ từ chối giao dịch.

### Thêm địa điểm / nhiệm vụ
Sửa `LOCATIONS` / `MISSIONS` ở đầu `src/data/store.js` → `npm run seed` → chạy `seed.sql`.

### Chỉnh số kinh tế (thưởng, vốn đầu, streak)
Đầu `src/data/store.js`. Đọc `KINH-TE-GAME.md` để hiểu cân bằng + rủi ro "catalog cạn nhanh".

### ⛔ Tuyệt đối KHÔNG
- Sửa `supabase.js`, `backend.js`, hay bất cứ file nào trong `supabase/` mà chưa hiểu rõ — đây là lớp chống gian lận.
- Commit file `.env` lên GitHub (chứa mã kết nối). Đã chặn sẵn, đừng gỡ chặn.
- Tự cộng 🍩 trong code màn hình — mọi thay đổi tiền phải qua RPC máy chủ.

---

## 3. SPEC CHO ĐỘI ART — đọc trước khi vẽ hàng loạt 🚨

Hiện nhân vật đang vẽ tạm bằng lưới pixel 24×24 trong code. Khi có art thật, ta
sẽ chuyển sang **hệ ghép ảnh (image-driven)**: mỗi món đồ là một file ảnh, app
xếp chồng lên nhau. Để làm được, đội art phải **chốt các thông số sau TRƯỚC**:

### Các quyết định cần chốt
1. **Kích thước canvas**: mọi ảnh vẽ trên cùng một khung vuông cố định (đề xuất **512×512 px**). Nhân vật đặt cùng một vị trí trong khung ở mọi món.
2. **Cách ghép**: **mỗi món xuất trên trọn khung 512×512, nền trong suốt, căn sẵn đúng vị trí** — app chỉ việc chồng ảnh lên nhau, không cần tính toạ độ. (Cách này chống lỗi lệch tốt nhất.)
3. **Thứ tự lớp (z-order)** từ dưới lên — đề xuất:
   `nền (bg) → thân gốc (base) → quần → áo → tóc → kính → mũ → phụ kiện tay`
   Đội art xác nhận hoặc đề xuất khác.
4. **Nhân vật gốc "vanilla"**: một hình trung tính (kiểu Charlie) để làm nền cho mọi đồ. Giữ triết lý: bản thân trơn, cá tính do đồ.
5. **Tĩnh hay động?** Bản đầu nên **tĩnh** (1 tư thế). Nếu muốn hoạt ảnh (nhấp nháy mắt, đung đưa) → bàn riêng, phức tạp hơn nhiều.
6. **Định dạng & tên file**: PNG-24 nền trong suốt. Tên theo mẫu `{slot}-{id}.png` (vd `hat-non-la.png`). Nén nhẹ (mỗi file nên < 50KB).
7. **Bảng màu + style guide**: do đội art sở hữu; nên có 1 file chuẩn để nhất quán.

### Bàn giao art cho code thế nào
- Bỏ file ảnh vào `public/skins/` theo đúng tên quy ước.
- Báo Claude (hoặc dev) để thêm dòng tương ứng vào `items.js` + nâng `Avatar.jsx` đọc ảnh.
- **Có thể gửi nhỏ giọt**: 5 món trước để chạy thử pipeline, rồi mới sản xuất hàng loạt.

> 💡 Khuyến nghị: **vẽ 2–3 món mẫu + nhân vật gốc trước**, chạy thử end-to-end
> (hiện trong Store, mặc lên người, hiện trên feed) rồi mới vẽ 100 món. Sai chuẩn
> sớm sửa rẻ, sai chuẩn muộn sửa rất đắt.

---

## 4. LÀM VIỆC NHÓM — GitHub, Vercel, Supabase

### GitHub (nhiều người cùng code)
- Chủ kho (Nghee-PWA): **Settings → Collaborators** → mời từng thành viên.
- Quy trình: **mỗi người làm trên một "nhánh" (branch) riêng**, xong mở "Pull Request" để trộn vào `main`. Không đẩy thẳng vào `main` để tránh đè code nhau.
- Nên bật "branch protection" cho `main` (bắt buộc review trước khi trộn).

### Vercel (xem thử từng nhánh)
- Vercel **tự tạo một link xem thử riêng cho mỗi Pull Request** → mỗi người thử phần của mình trên link riêng, không ảnh hưởng bản chính. Không cần cấu hình gì thêm.

### Supabase (tách môi trường)
- **Nên tạo một project Supabase "nháp" (dev) riêng** để đội thử nghiệm (xoá/sửa dữ liệu thoải mái), giữ project thật (production) sạch.
- Mỗi lập trình viên tự tạo file `.env` trên máy mình (copy từ `.env.example`), điền mã của project dev. **Không ai commit `.env`.**
- Mã trên Vercel (production) đặt trong **Settings → Environment Variables**, không nằm trong code.

---

## 5. Việc còn dang dở (gợi ý ưu tiên cho đội)

- [ ] **Chốt spec art** (mục 3) — làm ngay, chặn mọi việc art phía sau
- [ ] Nâng `Avatar.jsx` sang hệ ghép ảnh (sau khi có 2–3 món mẫu)
- [ ] **Màn kết bạn thật**: hiện nút "Thêm bạn" mới là demo; cần màn nhập mã người chơi để 2 người thật kết nối (backend đã có bảng `friendships` + realtime, chỉ thiếu giao diện)
- [ ] Nút "Báo cáo ảnh xấu" + quy trình kiểm duyệt (bắt buộc trước khi mở công khai)
- [ ] Chống giả GPS ở mức cơ bản (xem ghi chú trong code)
- [ ] Thêm địa điểm (20–30 nơi) + nhiệm vụ ngày/tuần (chống "catalog cạn nhanh")

---

## 6. Bản đồ tài liệu

| File | Nội dung |
| --- | --- |
| `HA-TANG.md` | Hạ tầng tổng thể (GitHub/Vercel/Supabase) — cho người non-tech |
| `BACKEND-SUPABASE.md` | Backend hoạt động thế nào, chống gian lận ra sao |
| `KINH-TE-GAME.md` | Nền kinh tế 🍩, cân bằng, rủi ro |
| `CAI-DAT.md` | Các bước dựng hạ tầng từ đầu |
| **`BAN-GIAO-DOI-NGU.md`** | **(file này)** — bàn giao cho đội |
