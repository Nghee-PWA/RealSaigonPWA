# 🧠 BỘ NÃO SUPABASE — GIẢI THÍCH CHO NGƯỜI KHÔNG LÀM KỸ THUẬT

> Toàn bộ phần "chạy ngầm phía sau" đã được **thiết kế và viết code sẵn**. Bạn
> chưa cần làm gì cả — khi nào muốn bật, chỉ mất ~15 phút theo mục 5.

## 1. Supabase lo những gì?

Hãy hình dung Supabase là **cửa hàng phía sau** của game, gồm 4 quầy:

1. **Quầy vé (Auth):** khách vừa vào là được phát một "vé vô hình" (tài khoản ẩn
   danh) — chơi ngay, không cần đăng ký. Khi nào khách muốn, dán tên lên vé
   (đăng nhập Google/Apple) mà **không mất dữ liệu**.
2. **Sổ cái (Database):** ghi mọi thứ — nhân vật, số 🍩, đồ đang mặc, bạn bè,
   lịch sử check-in.
3. **Kho ảnh (Storage):** chứa ảnh khách chụp ở các địa điểm.
4. **Loa thông báo (Realtime):** khi một người thay đồ, bạn bè họ được "hô" ngay
   để thấy — chính là hiệu ứng "thấy nhau gần realtime" kiểu Walking Charlie.

## 2. Điều quan trọng nhất: KHÁCH KHÔNG TỰ CỘNG TIỀN ĐƯỢC

Đây là lý do thiết kế này đáng giá. Trong bản demo hiện tại, app tự cộng 🍩 —
nghĩa là người rành máy tính có thể "chỉnh" cho mình vô số donut. **Bản Supabase
thì không.**

Cơ chế: mọi việc động đến tiền (check-in nhận thưởng, mua đồ, nhận nhiệm vụ) đều
phải **gửi yêu cầu lên máy chủ**, và **máy chủ tự tra bảng giá gốc của nó** rồi
mới cộng/trừ. App chỉ được "xin", không được "tự quyết". Ví dụ:

- App nói: "tôi vừa check-in Nhà thờ Đức Bà" → máy chủ tự biết nơi đó thưởng 30 🍩,
  tự cộng 30, và **từ chối nếu người này đã check-in nơi đó rồi** (chống farm).
- App nói: "tôi mua nón lá" → máy chủ tự tra giá 40, kiểm tra đủ tiền chưa, có
  mua trùng không, rồi mới trừ.
- Máy chủ cũng khóa để **người A không đọc/sửa được dữ liệu của người B** (chỉ
  xem được hồ sơ của chính mình và của bạn bè).

## 3. Các mảnh đã có trong dự án

| File                        | Là gì                                                        |
| --------------------------- | ------------------------------------------------------------ |
| [supabase/schema.sql](supabase/schema.sql) | Bản thiết kế sổ cái + luật bảo mật + các "hàm giao dịch" tiền |
| [supabase/seed.sql](supabase/seed.sql)     | Bảng giá gốc (đồ, địa điểm, nhiệm vụ) — tự sinh từ code       |
| [src/data/supabase.js](src/data/supabase.js) | Phần app nói chuyện với Supabase                            |
| [src/data/backend.js](src/data/backend.js)  | "Công tắc" đổi giữa demo ↔ cloud (chỉ 1 dòng)               |
| [.env.example](.env.example)                | Mẫu file điền mã kết nối                                     |

## 4. Tài khoản ẩn danh → đăng nhập (đúng yêu cầu của bạn)

Bạn muốn "không bắt đăng nhập, nhưng khuyến khích". Cơ chế:

- Mở app lần đầu → tự có tài khoản ẩn danh, chơi + kết bạn + tích đồ bình thường.
- Khi khách bấm "Đăng nhập với Google" (lúc nào tùy họ) → tài khoản ẩn danh được
  **nâng cấp tại chỗ**, giữ nguyên toàn bộ 🍩 và đồ. Không có chuyện mất tiến trình.
- Lợi ích của việc đăng nhập: khách đổi điện thoại vẫn còn dữ liệu (dù bạn nói
  không cần đồng bộ đa máy, đây vẫn là "phao" chống mất dữ liệu khi đổi máy).

## 5. Khi bạn muốn bật (các bước, ~15 phút)

1. Tạo tài khoản miễn phí ở **supabase.com**, tạo 1 project.
2. Vào **SQL Editor**, dán nội dung `schema.sql` rồi Run; dán tiếp `seed.sql` rồi Run.
3. Vào **Storage**, tạo một "bucket" tên `photos` (để công khai đọc).
4. Vào **Project Settings → API**, copy 2 giá trị vào file `.env` (theo mẫu `.env.example`).
5. Chạy `npm install` (để cài thư viện Supabase), rồi trong [backend.js](src/data/backend.js)
   đổi sang dòng `supabase`, và trong `main.jsx` gọi `init()`.

> Tất cả những bước này mình (Claude) làm cùng bạn được — bạn chỉ cần tạo tài
> khoản và copy 2 mã kết nối, phần còn lại mình xử lý.

## 6. Chi phí

Miễn phí tới ~50.000 người dùng/tháng và 1GB ảnh (~4.000–5.000 tấm đã nén). Vượt
mức: ~$25/tháng, tăng chủ yếu theo dung lượng ảnh. Xem thêm [HA-TANG.md](HA-TANG.md).
