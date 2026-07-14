import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import { init, dailyLogin } from './data/backend.js'
import './styles.css'

// Đăng ký service worker — mảnh code giúp game chạy offline
// và tự cập nhật khi có phiên bản mới.
registerSW({ immediate: true })

// Khởi động backend: bản demo là no-op; bản cloud đăng nhập ẩn danh,
// nạp dữ liệu từ Supabase và tự nhận thưởng đăng nhập.
init()
// Thưởng đăng nhập hằng ngày (bản cloud đã xử lý trong init())
dailyLogin?.()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
