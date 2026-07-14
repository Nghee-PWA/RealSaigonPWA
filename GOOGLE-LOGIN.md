# 🔗 BẬT ĐĂNG NHẬP GOOGLE — HƯỚNG DẪN CẤU HÌNH

> Nút "Liên kết với Google" đã có sẵn trong game (tab Profile). Nhưng để nó hoạt
> động, cần "đăng ký" app với Google — việc này chỉ bạn làm được vì cần tài khoản
> của bạn. Làm một lần, mất ~15 phút. **Chưa làm cũng không sao** — game vẫn chạy
> bình thường, bấm nút chỉ hiện thông báo chưa liên kết được.

## Vì sao phải "đăng ký với Google"?

Khi người chơi bấm "Liên kết với Google", Google sẽ hỏi họ: *"App **Khám Phá Sài
Gòn** muốn biết email của bạn — đồng ý không?"*. Để Google biết app của bạn là ai
mà hỏi như vậy, bạn phải đăng ký trước với Google và nhận về một cặp "giấy giới
thiệu" (Client ID + Client Secret) rồi đưa cặp đó cho Supabase giữ.

## Phần 1 — Đăng ký với Google (console.cloud.google.com)

1. Vào **console.cloud.google.com** → đăng nhập Google → tạo **New Project**
   (tên gì cũng được, vd `real-saigon`).
2. Menu ☰ → **APIs & Services → OAuth consent screen**:
   - Chọn **External** → điền tên app "Khám Phá Sài Gòn" + email của bạn → Save.
   - (Các bước sau cứ Save/Continue mặc định.)
3. Menu ☰ → **APIs & Services → Credentials** → **Create Credentials →
   OAuth client ID**:
   - Application type: **Web application**
   - **Authorized redirect URIs** — bấm Add URI và dán CHÍNH XÁC:
     ```
     https://rsnhbbohsrpvwxgwdkjx.supabase.co/auth/v1/callback
     ```
   - Bấm **Create** → hiện ra **Client ID** và **Client Secret** → copy cả hai.

## Phần 2 — Đưa "giấy giới thiệu" cho Supabase

1. Vào Supabase → **Authentication → Sign In / Providers** → tìm **Google**.
2. Bật lên, dán **Client ID** + **Client Secret** vừa lấy → **Save**.

## Phần 3 — Hai công tắc phụ trong Supabase

1. **Cho phép nối tài khoản:** Authentication → Settings → tìm và bật
   **"Allow manual linking"** → Save. (Thiếu cái này, tài khoản ẩn danh không
   "nâng cấp" thành tài khoản Google được.)
2. **Khai báo địa chỉ game:** Authentication → **URL Configuration**:
   - **Site URL**: `https://real-saigon-pwa.vercel.app`
   - **Redirect URLs** thêm: `http://localhost:5173` (để thử trên máy)

## Kiểm tra

Mở game → tab Profile → bấm **🔗 Liên kết với Google** → hiện màn hình chọn tài
khoản Google → chọn xong quay về game, Profile hiện "✅ Đã liên kết: email...".
Từ giờ người chơi đó đổi điện thoại, đăng nhập Google là lấy lại đúng nhân vật.
