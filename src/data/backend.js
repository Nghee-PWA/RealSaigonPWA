// ============================================================
// CÔNG TẮC NGUỒN DỮ LIỆU
//
// Mọi màn hình game lấy dữ liệu & hành động từ đây. Muốn chuyển
// từ bản demo (lưu trên máy) sang bản thật (Supabase cloud), chỉ
// cần đổi DÒNG export bên dưới — không đụng vào màn hình nào.
//
//   HIỆN TẠI: demo (localStorage) — chạy ngay, không cần tài khoản.
//   KHI SẴN SÀNG: mở dòng supabase, đóng dòng store (và làm 3 việc
//   ghi trong supabase.js: npm install, điền .env, chạy SQL).
// ============================================================

export * from './store.js' // ← DEMO (đang bật)
// export * from './supabase.js'  // ← CLOUD (Supabase). Nhớ gọi init() trong main.jsx.
