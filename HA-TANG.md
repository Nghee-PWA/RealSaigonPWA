# 🏗️ HẠ TẦNG CỦA GAME — GIẢI THÍCH CHO NGƯỜI KHÔNG LÀM KỸ THUẬT

> Tài liệu này giải thích toàn bộ "phần chìm của tảng băng": game chạy trên cái gì,
> dữ liệu nằm ở đâu, mỗi dịch vụ để làm gì, và tốn bao nhiêu tiền.

---

## 1. Bức tranh toàn cảnh

Hãy tưởng tượng game của bạn là một **cửa hàng**:

```
  [Máy của bạn]          [GitHub]              [Vercel]            [Người chơi]
  Xưởng sản xuất   →   Tủ hồ sơ lưu       →   Mặt bằng cửa hàng  →  Khách ghé chơi
  (viết code)          (mọi phiên bản         (nơi game "sống"      (mở bằng trình
                        của code)              trên internet)         duyệt điện thoại)

                                               [Supabase]
                                               Kho + sổ sách phía sau
                                               (tài khoản, bạn bè, ảnh,
                                                donut, quần áo...)
```

Một bản cập nhật game đi như sau: bạn/lập trình viên sửa code trên máy → đẩy lên
GitHub → Vercel **tự động** lấy bản mới về và đưa lên mạng → người chơi mở game
là có bản mới ngay. Không cần chờ App Store duyệt.

---

## 2. Từng mảnh ghép

### 🖥️ Máy của bạn + Node.js — "xưởng sản xuất"

- **Là gì:** nơi code được viết và chạy thử trước khi đưa lên mạng.
- **Node.js** là bộ công cụ để chạy dự án web trên máy (máy bạn đã cài sẵn).
- Gõ `npm run dev` trong thư mục này là game hiện lên ở địa chỉ `localhost` —
  tức "chạy nội bộ trong máy", chưa ai ngoài bạn thấy được.
- **Chi phí:** 0đ.

### 📁 GitHub — "tủ hồ sơ có máy thời gian"

- **Là gì:** dịch vụ lưu trữ code trên mây, kèm toàn bộ lịch sử thay đổi.
  Ai sửa gì, sửa lúc nào, đều tra lại được — và **quay ngược về bản cũ** được
  nếu bản mới có lỗi.
- **Vì sao cần:** (1) không sợ mất code khi hỏng máy; (2) nhiều người cùng làm
  không giẫm chân nhau; (3) là "nguồn" để Vercel tự động lấy code đem lên mạng.
- **Cần làm gì:** tạo tài khoản miễn phí tại github.com, tạo một "repository"
  (kho chứa) tên `nnn-pwa`. Mình sẽ hướng dẫn khi đến bước này.
- **Chi phí:** 0đ (kho riêng tư cũng miễn phí).

### 🌐 Vercel — "mặt bằng cửa hàng trên internet"

- **Là gì:** dịch vụ hosting — nơi chứa game để cả thế giới truy cập.
- **Điểm hay nhất:** kết nối 1 lần với GitHub, sau đó **mỗi lần code mới được
  đẩy lên GitHub, Vercel tự dựng và phát hành bản mới trong ~1 phút**. Không ai
  phải "bấm nút deploy" thủ công.
- Kèm sẵn: địa chỉ miễn phí dạng `nnn-pwa.vercel.app`, ổ khóa bảo mật HTTPS
  (bắt buộc để cài PWA lên điện thoại), và mạng phân phối toàn cầu (người chơi
  ở Việt Nam tải game từ máy chủ gần Việt Nam → mở nhanh).
- **Cần làm gì:** tạo tài khoản miễn phí tại vercel.com (đăng nhập bằng chính
  tài khoản GitHub cho tiện), bấm "Import" repo `nnn-pwa`. Xong.
- **Chi phí:** 0đ cho quy mô hàng chục nghìn người chơi. Gói trả phí ($20/tháng)
  chỉ cần khi rất đông người hoặc cần tính năng cho team.

### 🗄️ Supabase — "bộ não và nhà kho phía sau"

- **Là gì:** dịch vụ backend trọn gói. Game của bạn có tính năng social nên
  dữ liệu phải nằm trên mây để bạn bè nhìn thấy của nhau. Supabase lo 4 việc:
  1. **Tài khoản ẩn danh** — người chơi mở game là có "thẻ" vô hình ngay,
     không cần đăng ký. Khi họ chịu đăng nhập (Google/Apple) thì chỉ là dán
     tên lên thẻ có sẵn, không mất dữ liệu.
  2. **Database (sổ cái)** — lưu hồ sơ nhân vật, donut, quần áo, bạn bè,
     nhiệm vụ, lịch sử check-in.
  3. **Storage (kho ảnh)** — chứa ảnh người chơi chụp tại các địa điểm.
  4. **Realtime (loa thông báo)** — khi ai đó thay đồ hoặc check-in, app của
     bạn bè họ được "hô" ngay để vẽ lại → chính là hiệu ứng "thấy nhau gần
     như realtime" kiểu Walking Charlie.
- **Trạng thái hiện tại:** ⚠️ **CHƯA kết nối.** Bản demo đang lưu tạm mọi thứ
  ngay trên máy người chơi. Toàn bộ code đã được viết gọn vào một file
  (`src/data/store.js`) để khi nối Supabase chỉ sửa đúng chỗ đó.
- **Cần làm gì (khi đến lúc):** tạo tài khoản miễn phí tại supabase.com,
  tạo 1 "project", đưa cho mình 2 dòng mã kết nối. Phần còn lại mình làm.
- **Chi phí:** 0đ lúc đầu (đủ ~50.000 lượt người dùng/tháng, 1GB ảnh ≈
  4.000–5.000 tấm đã nén). Khi vượt: gói $25/tháng. **Ảnh là thứ đầu tiên
  làm phát sinh chi phí khi app đông** — nên game đã tự nén ảnh trước khi lưu.

### 🏷️ Tên miền — "biển hiệu cửa hàng" (chưa cần vội)

- Mặc định game sẽ có địa chỉ miễn phí `ten-game.vercel.app`. Muốn địa chỉ đẹp
  kiểu `tengame.vn` thì mua tên miền (~250–350k/năm) rồi trỏ về Vercel —
  thao tác 10 phút, làm lúc nào cũng được.

---

## 3. Phần "app hóa" (PWA) — đã làm sẵn trong code

Hai mảnh giúp trang web này hành xử như app thật, **không tốn tiền**, chỉ là code:

- **Manifest** ("giấy khai sinh") — khai báo tên game, icon, màu sắc. Nhờ nó mà
  điện thoại hiện nút "Thêm vào màn hình chính" và game mở toàn màn hình như app.
- **Service Worker** ("nhân viên trực cửa") — lưu sẵn game vào máy người chơi để
  lần sau mở tức thì kể cả mạng yếu, và âm thầm tải bản cập nhật mới khi có.

---

## 4. Bảng chi phí tóm tắt

| Hạng mục            | Lúc bắt đầu | Khi đông người chơi          |
| ------------------- | ----------- | ---------------------------- |
| GitHub (lưu code)   | 0đ          | 0đ                           |
| Vercel (hosting)    | 0đ          | ~$20/tháng nếu rất đông      |
| Supabase (backend)  | 0đ          | ~$25/tháng, tăng theo số ảnh |
| Tên miền (tùy chọn) | 0đ          | ~250–350k/năm                |
| **Tổng để ra mắt**  | **0đ**      |                              |

---

## 5. Hiện trạng & các bước tiếp theo

- [x] Khung game PWA chạy được trên máy (nhân vật, check-in GPS, chụp ảnh,
      nhiệm vụ, cửa hàng skin, bạn bè + bảng tin — dữ liệu demo lưu trên máy)
- [ ] Tạo tài khoản GitHub → đẩy code lên
- [ ] Tạo tài khoản Vercel → nối với GitHub → game có địa chỉ công khai
- [ ] Tạo tài khoản Supabase → nối backend thật (tài khoản ẩn danh, bạn bè
      thật, ảnh lưu trên mây, thấy nhau realtime)
- [ ] Thêm nút "Báo cáo ảnh xấu" + quy trình kiểm duyệt ảnh
- [ ] (Tùy chọn) Mua tên miền riêng
- [ ] (Tùy chọn) Thống kê người chơi, thông báo đẩy

> 💡 Cả 3 tài khoản trên đều miễn phí và chỉ cần email. Khi bạn sẵn sàng,
> nói với Claude "hướng dẫn tôi tạo tài khoản GitHub/Vercel/Supabase" —
> mình sẽ đi cùng bạn từng bước.

---

## 6. Từ điển mini

| Từ                 | Nghĩa đời thường                                                       |
| ------------------ | ---------------------------------------------------------------------- |
| **PWA**            | Trang web "hóa trang" thành app, cài được lên màn hình chính           |
| **Hosting**        | Thuê chỗ trên internet để đặt game                                     |
| **Deploy**         | Đem bản game mới "lên sóng"                                            |
| **Backend**        | Phần chạy ngầm phía sau: tài khoản, dữ liệu, kho ảnh                   |
| **Database**       | Sổ cái điện tử ghi mọi dữ liệu của người chơi                          |
| **Repository**     | Một "kho chứa code" trên GitHub                                        |
| **HTTPS**          | Ổ khóa bảo mật của trang web — PWA bắt buộc phải có                    |
| **localhost**      | Game chạy nội bộ trong máy bạn, người ngoài chưa thấy                  |
| **Realtime**       | Dữ liệu đổi ở máy này, máy kia thấy ngay sau 1–2 giây                  |
| **localStorage**   | Ngăn kéo nhỏ trong trình duyệt — nơi bản demo đang lưu tạm tiến trình  |
