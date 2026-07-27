# 💻 CODE DỰ ÁN TRÊN NHIỀU MÁY TÍNH

> GitHub chính là thứ giúp bạn làm việc này. Code nằm trên mây; máy nào cũng
> "tải về" (clone) được, sửa xong "đẩy lên" (push), máy khác "kéo về" (pull).

## Nguyên tắc vàng: PULL trước khi làm, PUSH sau khi xong

Để nhiều máy không đá nhau, tạo thói quen:
1. **Mở máy ra → `git pull`** (kéo bản mới nhất về trước khi sửa)
2. Làm việc, sửa code
3. **Xong → `git push`** (đẩy lên để máy khác thấy)

Quên `pull` trước khi làm là nguồn gốc của mọi rắc rối "code hai máy lệch nhau".

## Cài đặt một máy mới (làm 1 lần cho mỗi máy)

### Bước 1: Cài công cụ
- **Node.js** — tải bản LTS ở nodejs.org (bắt buộc)
- **Git** — tải ở git-scm.com (bắt buộc)
- **GitHub Desktop** (github.com/apps/desktop) — nếu muốn bấm chuột thay vì gõ lệnh
- **Trình soạn code** — VS Code (code.visualstudio.com) hoặc thứ bạn quen
- **Claude Code** — nếu muốn tiếp tục làm việc với mình trên máy đó

### Bước 2: Tải dự án về (clone)
Mở Terminal / PowerShell tại thư mục bạn muốn chứa dự án, chạy:
```bash
git clone https://github.com/Nghee-PWA/RealSaigonPWA.git
cd RealSaigonPWA
```
(Hoặc GitHub Desktop → File → Clone repository → chọn RealSaigonPWA.)

### Bước 3: Cài thư viện
```bash
npm install
```

### Bước 4: ⚠️ Tạo lại file `.env` (QUAN TRỌNG)
File `.env` chứa 2 mã kết nối Supabase — vì lý do an toàn, nó **cố tình KHÔNG
nằm trên GitHub**, nên clone về sẽ KHÔNG có. Bạn phải tạo lại trên mỗi máy:

1. Copy file `.env.example` thành `.env`
2. Điền 2 giá trị (lấy ở Supabase → Project Settings → API, hoặc copy từ file
   `.env` trên máy cũ của bạn):
   ```
   VITE_SUPABASE_URL=https://rsnhbbohsrpvwxgwdkjx.supabase.co
   VITE_SUPABASE_ANON_KEY=(chuỗi anon key)
   ```

> 💡 Mẹo an toàn: gửi nội dung `.env` cho chính mình qua tin nhắn riêng / ghi chú
> bảo mật để lần sau cài máy mới chỉ việc dán. **Đừng** đưa file này lên GitHub
> hay chỗ công khai.

### Bước 5: Chạy thử
```bash
npm run dev
```
Mở `http://localhost:5173` — nếu game hiện ra và có dữ liệu (địa điểm, 🍩) thì
máy mới đã sẵn sàng.

## Làm việc hằng ngày trên nhiều máy

| Tình huống | Làm gì |
| --- | --- |
| Bắt đầu ngồi vào máy | `git pull` |
| Sửa xong, muốn lưu + chia sẻ | `git add -A` → `git commit -m "..."` → `git push` |
| Máy kia vừa push, máy này muốn cập nhật | `git pull` |
| Lỡ sửa cùng chỗ trên 2 máy (hiếm khi solo) | Git báo "conflict" — gọi Claude xử lý |

## Lưu ý

- **Node.js / thư viện**: mỗi máy tự cài (`npm install`), không đi theo GitHub —
  đúng như `node_modules` bị loại ra khỏi kho.
- **`.env`**: mỗi máy tự tạo (Bước 4), không đi theo GitHub.
- **Mọi thứ khác** (code, tài liệu, cấu hình): tự đồng bộ qua `git pull`/`push`.
