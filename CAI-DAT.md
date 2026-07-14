# 🚀 CẨM NANG CÀI ĐẶT HẠ TẦNG — LÀM TỪNG BƯỚC

> Dành cho người không rành kỹ thuật. Làm theo đúng thứ tự. Cả 3 tài khoản đều
> **miễn phí, chỉ cần email**. Không cần thẻ tín dụng để bắt đầu.

## Bức tranh: 3 tài khoản, mỗi cái một việc

```
  GitHub  ──►  Vercel  ──►  link game công khai
  (giữ code)   (đưa lên mạng)
                              ▲
  Supabase ────────────────────┘
  (tài khoản, dữ liệu, ảnh, bạn bè)
```

Thứ tự khuyến nghị: **GitHub → Vercel → (chơi thử) → Supabase**. Lý do: có link
chạy được trước đã, xác nhận vòng chơi ổn, rồi mới đầu tư phần social.

---

## GIAI ĐOẠN A — Đưa game lên mạng (~30 phút)

### Bước 1: Tài khoản GitHub — "tủ hồ sơ giữ code"

- Vào **github.com** → **Sign up** → dùng email, đặt username (vd `nnn-studio`).
- Vì sao cần: giữ code an toàn + là "nguồn" để Vercel tự lấy code.
- Bạn **không cần biết dùng Git**. Claude sẽ giúp đẩy code lên; hoặc dùng app
  **GitHub Desktop** (giao diện bấm chuột, không cần gõ lệnh).

### Bước 2: Đưa code lên GitHub

- Tạo một "repository" (kho) tên `nnn-pwa`, để **Private** (riêng tư) cũng được.
- Đẩy toàn bộ thư mục dự án lên. (Claude làm cùng bạn — chỉ vài phút.)

### Bước 3: Tài khoản Vercel — "mặt bằng trên internet"

- Vào **vercel.com** → **Sign up** → chọn **Continue with GitHub** (đăng nhập
  bằng chính tài khoản GitHub cho tiện, khỏi tạo mật khẩu mới).
- Bấm **Add New → Project** → chọn kho `nnn-pwa` → **Import** → **Deploy**.
- Vercel tự nhận đây là dự án Vite, tự build. Chờ ~1 phút.

### ✅ Kết quả giai đoạn A

Bạn có một link dạng `nnn-pwa.vercel.app`. Mở trên điện thoại → bấm "Thêm vào màn
hình chính" → game hiện như app thật. **Từ giờ, mỗi lần code mới đẩy lên GitHub,
Vercel tự cập nhật bản mới trong ~1 phút — không phải làm gì thêm.**

> Lúc này game vẫn ở "chế độ demo" (dữ liệu lưu trên máy người chơi, bạn bè ảo).
> Đủ để test GPS thật + camera thật + cảm giác app. Chưa có social thật.

---

## GIAI ĐOẠN B — Bật bộ não thật (Supabase) (~15 phút)

Làm khi đã hài lòng với vòng chơi ở giai đoạn A.

### Bước 4: Tài khoản Supabase

- Vào **supabase.com** → **Start your project** → đăng nhập bằng GitHub.
- **New project**: đặt tên, chọn region **Southeast Asia (Singapore)** cho gần
  Việt Nam, đặt một mật khẩu database (lưu lại).

### Bước 5: Dựng sổ cái + bảng giá

- Vào **SQL Editor** → dán nội dung file `supabase/schema.sql` → **Run**.
- Dán tiếp `supabase/seed.sql` → **Run**.
- Vào **Storage** → tạo bucket tên `photos` (bật public đọc).

### Bước 6: Nối app với Supabase

- Vào **Project Settings → API**, copy 2 giá trị (URL + anon key).
- Điền vào file `.env` (theo mẫu `.env.example`).
- Đổi "công tắc" trong `src/data/backend.js` sang chế độ cloud.
- Đẩy lên GitHub → Vercel tự cập nhật.

> ⚠️ Bước 4–6 hơi kỹ thuật. **Claude làm hết phần đụng code**; bạn chỉ cần tạo
> tài khoản và copy 2 mã kết nối cho Claude.

### ✅ Kết quả giai đoạn B

Người chơi có tài khoản (ẩn danh), ảnh lưu trên mây, bạn bè là người thật, thấy
nhau thay đồ gần realtime, và **không ai hack được số 🍩**.

---

## Cần chuẩn bị / quyết định trước khi setup

| Việc                    | Ghi chú                                                        |
| ----------------------- | -------------------------------------------------------------- |
| 1 địa chỉ email         | Dùng chung cho cả 3 tài khoản cho gọn                          |
| Tên game chính thức     | "NNN" đang là tạm — đổi lúc nào cũng được                      |
| Có mua tên miền không?  | Chưa cần. `*.vercel.app` miễn phí là đủ để bắt đầu             |
| Danh sách địa điểm       | Hiện 6 nơi. Nên nghĩ tới 20–30 nơi (xem KINH-TE-GAME.md)       |
| Art (hình nhân vật/đồ)  | Dạng PNG nền trong suốt + bảng màu. Gửi dần cũng được          |

## Chi phí (nhắc lại)

Cả 3 dịch vụ **miễn phí** ở giai đoạn đầu (tới hàng chục nghìn người chơi). Chỉ
phát sinh khi rất đông: Vercel ~$20/tháng, Supabase ~$25/tháng (chủ yếu do ảnh).
Tên miền (tùy chọn) ~250–350k/năm.

## Khi nào cần gọi lại Claude

- Bước 2 (đẩy code lên GitHub) và toàn bộ giai đoạn B (đụng code): làm cùng Claude.
- Bước 1, 3, 4 (tạo tài khoản, bấm nút trên web): bạn tự làm được, hoặc Claude
  hướng dẫn từng cú bấm.

> Nói với Claude: *"hướng dẫn tôi bước 2"* (hoặc bước bất kỳ) là mình đi cùng bạn.
