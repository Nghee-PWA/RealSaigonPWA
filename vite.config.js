import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Cấu hình build + phần "app hóa" (PWA).
// Khối manifest bên dưới là "giấy khai sinh" của app: tên, icon, màu sắc —
// điện thoại đọc nó để biết cách hiển thị khi người chơi bấm "Thêm vào màn hình chính".
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Khám Phá Sài Gòn',
        short_name: 'Real Saigon',
        description: 'Game khám phá Sài Gòn: đến địa điểm, chụp ảnh, nhận quà, sắm đồ cho nhân vật.',
        lang: 'vi',
        theme_color: '#8ed8c6',
        background_color: '#fdf6e3',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
