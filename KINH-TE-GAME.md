# 💰 THIẾT KẾ NỀN KINH TẾ GAME

> Game không đếm bước chân, nên "động cơ" giữ người chơi quay lại phải đến từ:
> **(1) đi địa điểm mới, (2) đăng nhập mỗi ngày, (3) khoe đồ với bạn bè.**
> Tài liệu này thiết kế dòng chảy của 🍩 (donut) sao cho vui và bền.

## 1. Người chơi kiếm 🍩 từ đâu?

| Nguồn                     | Số 🍩              | Tính chất                    |
| ------------------------- | ------------------ | ---------------------------- |
| Vốn khởi đầu              | 50                 | Một lần                      |
| Check-in 6 địa điểm       | 160 (20–35/nơi)    | Một lần mỗi nơi              |
| 6 nhiệm vụ                | 260                | Một lần                      |
| **→ Tổng thu "một lần"**  | **470**            |                              |
| Đăng nhập hằng ngày       | +10→+30/ngày (streak) | **Lặp lại — động cơ chính** |

Thưởng đăng nhập: ngày 1 +10, mỗi ngày liên tục +5, tối đa +30. Đứt chuỗi thì
về +10. Chơi liên tục 1 tuần ≈ +160 🍩; 30 ngày ≈ +850 🍩 (bình quân ~28/ngày).

## 2. Người chơi tiêu 🍩 vào đâu?

Toàn bộ 23 món trong Store cộng lại = **1.000 🍩**. Giá chia 3 tầng:

- **Rẻ (20–35):** áo, quần, tóc, phụ kiện cơ bản → mua được ngay ngày đầu.
- **Vừa (40–60):** nón lá, kính, các nền đẹp → mục tiêu vài ngày.
- **Cao (80–220):** áo dài, áo hoàng kim, vương miện, các set → mục tiêu nhiều tuần, món để "khoe".

Thu "một lần" (470) phủ được **47% catalog** — phần còn lại phải cày daily. Đây
là con số cố ý: đi chơi + làm nhiệm vụ cho bạn nửa tủ đồ, nửa còn lại là lý do
quay lại mỗi ngày.

## 3. Mô phỏng "người chơi chăm" (đã chạy bằng số thật)

| Ngày | Số dư 🍩 | Đã đi | Sở hữu    |
| ---- | -------- | ----- | --------- |
| 1    | 180      | 3/6   | 3/23 món  |
| 2    | 215      | 5/6   | 6/23 món  |
| 3    | 280      | 6/6   | 9/23 món  |
| 5    | 135      | 6/6   | 15/23 món |
| 7    | 20       | 6/6   | 19/23 món |
| 14   | 90       | 6/6   | 21/23 món |

**Điểm tốt:** ngày đầu đã customize được nhân vật (cảm giác "của mình" ngay), và
luôn có mục tiêu tiếp theo trong tầm với.

## 4. ⚠️ PHÁT HIỆN QUAN TRỌNG: catalog cạn quá nhanh

Người chơi chăm **sở hữu gần hết đồ sau ~1 tuần** (19/23). Khi hết đồ để mua,
🍩 mất giá trị và người chơi rời đi. Đây là rủi ro số 1 của thể loại này.

Game này về bản chất là **"live game" — phải bơm nội dung liên tục**, không phải
làm xong một lần. Ba cần cân (levers) để kéo dài vòng đời:

1. **Thêm địa điểm (mạnh nhất).** 6 nơi là quá ít. Bản thật nên có **20–30 nơi**
   chia theo quận/chủ đề (ẩm thực, lịch sử, cà phê…), ra thêm mỗi tháng vài nơi.
2. **Thêm đồ + đồ giới hạn thời gian.** Đồ theo mùa/sự kiện (Tết, Trung Thu),
   chỉ bán 1–2 tuần → tạo cảm giác khan hiếm và lý do quay lại.
3. **Nhiệm vụ lặp lại.** Ngoài nhiệm vụ một lần, thêm **nhiệm vụ ngày/tuần**
   (đổi mới liên tục): "hôm nay chụp 1 ảnh", "tuần này thăm 3 nơi", "rung chuông
   3 bạn". Đây là nguồn 🍩 lặp lại gắn với *hoạt động thật*, lành mạnh hơn là chỉ
   thưởng đăng nhập suông.

> Khuyến nghị: giữ nguyên bộ số hiện tại cho **bản ra mắt** (nó cho trải nghiệm
> 2 tuần đầu rất tốt), nhưng **lên kế hoạch nội dung định kỳ ngay từ đầu**. Một
> game đi bộ/khám phá sống hay chết ở nhịp ra nội dung, không phải ở lần code đầu.

## 5. Chỉnh số ở đâu?

Mọi con số nằm trong 2 file, sửa là app + máy chủ cùng đổi:

- Giá đồ, giá set: [items.js](src/data/items.js) (`price`)
- Thưởng check-in, thưởng nhiệm vụ, vốn khởi đầu, luật đăng nhập: [store.js](src/data/store.js)

Sau khi sửa, chạy `npm run seed` để cập nhật dữ liệu máy chủ ([seed.sql](supabase/seed.sql)).
Vì máy chủ giữ giá gốc, người chơi **không thể tự cộng tiền hay đổi giá** (xem [BACKEND-SUPABASE.md](BACKEND-SUPABASE.md)).
