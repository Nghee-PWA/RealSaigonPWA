# 🤖 ĐƯA GAME LÊN ANDROID (app thật) — GIẢI THÍCH & HƯỚNG DẪN

> Mục tiêu của bạn: **iOS phục vụ qua PWA** (cài từ trình duyệt), **Android làm
> app thật** đưa lên Google Play. Tài liệu này giải thích cặn kẽ hạ tầng và các
> bước. Phần khung Android đã được dựng sẵn trong dự án (thư mục `android/`).

---

## 1. Ý tưởng cốt lõi: MỘT bộ code, HAI đường ra

Bạn KHÔNG viết lại game. Cùng một bộ code React hiện tại phục vụ cả hai:

```
                   ┌──────────────────────────────► iOS + trình duyệt
                   │        (PWA qua Vercel — như hiện tại)
   Bộ code (GitHub)┤
                   │        Capacitor bọc lại
                   └──► dist/ ──────────────► app Android (.aab) ──► Google Play
                        (web đã build)         (Android Studio build)
```

**Capacitor** là công cụ (đã cài) đặt web app của bạn vào trong một "vỏ" Android
thật. Kết quả là một app `.aab` cài được như mọi app, đưa lên Play được. Game bên
trong vẫn là chính bộ code bạn đang có.

**Lợi ích khi Android là app thật (so với PWA):** lên được Google Play (dễ tìm,
dễ tin), có thể làm **thông báo đẩy** thật, xin quyền GPS/camera mượt hơn, và
"cảm giác app" tốt hơn.

---

## 2. Bạn cần những gì cho Android

| Thứ cần | Là gì | Chi phí |
| --- | --- | --- |
| **Android Studio** | Phần mềm chính thức của Google để build app Android. Cài trên máy bạn (nặng ~vài GB, cần máy khá). Tự kèm Java + Android SDK. | Miễn phí |
| **Tài khoản Google Play Developer** | "Giấy phép" để đăng app lên Play Store | **$25 một lần** (trọn đời) |
| **Chính sách bảo mật (Privacy Policy)** | Một trang web nêu rõ app thu thập gì. **Bắt buộc** vì game thu vị trí + ảnh + tài khoản | Miễn phí (tự viết / dùng mẫu) |
| **Chữ ký app (App Signing)** | "Con dấu" xác nhận app là của bạn. Google Play tự lo phần lớn (Play App Signing) | Miễn phí |
| **Ảnh cho gian hàng** | Icon, vài ảnh chụp màn hình, mô tả | Miễn phí (tự làm) |

---

## 3. Quy trình đưa lên Android (khi bạn sẵn sàng)

### A. Cài Android Studio (1 lần)
Tải ở **developer.android.com/studio**, cài đặt (chọn mặc định). Lần đầu mở nó
sẽ tải thêm Android SDK — cứ đồng ý.

### B. Mở dự án Android (mỗi lần cập nhật game)
Trong thư mục dự án, chạy 2 lệnh:
```bash
npm run android:sync    # build web mới nhất + đưa vào vỏ Android
npm run android:open    # mở dự án trong Android Studio
```
> Lưu ý: `android:sync` build từ file `.env` trên máy — nên **máy build Android
> phải có file `.env`** (xem CODE-NHIEU-MAY.md).

### C. Chạy thử
Trong Android Studio, bấm nút **▶ Run** để chạy game trên máy ảo (emulator) hoặc
điện thoại Android cắm dây. Kiểm tra check-in GPS + chụp ảnh chạy đúng.

### D. Đóng gói để phát hành
Android Studio → **Build → Generate Signed Bundle / APK → Android App Bundle
(.aab)**. Làm theo hướng dẫn tạo chữ ký lần đầu (lưu file keystore + mật khẩu
thật kỹ — mất là rắc rối lớn).

### E. Đăng lên Google Play
- Tạo tài khoản ở **play.google.com/console** (trả $25 một lần)
- Tạo app mới → điền thông tin gian hàng (tên, mô tả, ảnh, **link privacy policy**)
- Điền form **Data Safety** (khai báo thu thập vị trí/ảnh/tài khoản — trung thực)
- Tải file `.aab` lên → gửi duyệt. Google duyệt thường vài giờ đến 1-2 ngày.

---

## 4. Lưu ý quan trọng riêng cho game này

- **Tên định danh app** hiện là `com.realsaigon.app` (trong `capacitor.config.json`).
  Cái này **không đổi được sau khi đăng Play lần đầu** — nói Claude nếu muốn đổi
  trước khi phát hành.
- **Bắt buộc có Privacy Policy** vì thu vị trí + ảnh + tài khoản. Không có là
  Google từ chối. (Claude giúp soạn được một bản khi cần.)
- **Đăng nhập Google trong app Android** cần cấu hình thêm (deep link) hơi khác
  bản web — để làm sau, khi bạn build thử được trên máy có Android Studio. Tài
  khoản ẩn danh + kết bạn + mua đồ thì chạy ngay không cần cấu hình thêm.
- **Cập nhật app**: mỗi lần sửa game, phải build lại (`android:sync`) + đăng bản
  mới lên Play (duyệt lại). Khác với PWA/web cập nhật tức thì. (Có dịch vụ
  "live update" để né bước này — tính sau nếu cần.)
- **iOS vẫn dùng PWA** như hiện tại — không đụng gì. Sau này muốn iOS cũng thành
  app thật thì thêm `npx cap add ios` (cần máy Mac + Apple Developer $99/năm).

---

## 5. Việc Claude làm được vs. việc bạn làm

| Claude làm | Bạn làm (cần máy/tài khoản của bạn) |
| --- | --- |
| Đã dựng khung `android/`, cấu hình, quyền GPS/camera | Cài Android Studio |
| Chỉnh tên app, icon, cấu hình build | Tạo tài khoản Play ($25) |
| Soạn mẫu Privacy Policy | Bấm Run/Build trong Android Studio |
| Wiring plugin GPS/camera native nếu cần | Tạo & giữ file chữ ký (keystore) |
| Cấu hình đăng nhập Google cho native | Điền gian hàng + gửi duyệt |

> Tóm lại: **khung đã sẵn**. Việc còn lại lớn nhất về phía bạn là **cài Android
> Studio** và **mở tài khoản Play $25**. Khi có 2 thứ đó, gọi Claude đi cùng từng
> bước build + phát hành.
