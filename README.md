# 🏡 VillaViet — Nền tảng cho thuê Villa cao cấp

Website cho thuê villa nghỉ dưỡng với giao diện tiếng Việt, hiệu ứng cuộn phong cách Apple và tích hợp Docker đầy đủ.

## ✨ Tính năng

- **Apple-style sticky scroll** — Showcase villa với hiệu ứng cuộn mượt mà như trang sản phẩm Apple
- **Parallax hero** — Hiệu ứng chiều sâu khi cuộn trang
- **Marquee text animation** — Text chạy ngang độc đáo
- **Custom cursor** — Con trỏ tùy chỉnh sang trọng
- **Reveal animations** — Các phần tử xuất hiện khi cuộn đến
- **Booking form** — Form đặt phòng kết nối với backend API
- **Loading screen** — Màn hình loading đẹp mắt
- **Fully responsive** — Tương thích mobile

## 🐳 Chạy với Docker (Khuyên dùng)

```bash
# Clone / tải về project
cd villa-rental

# Build và chạy tất cả services
docker-compose up --build

# Truy cập:
# Frontend: http://localhost
# Backend API: http://localhost:3001/api
```

## 🛠 Chạy thủ công (Development)

### Backend
```bash
cd backend
npm install
npm run dev     # Chạy với nodemon (hot reload)
# hoặc
npm start       # Production
```

### Frontend
```bash
cd frontend
# Mở index.html trong trình duyệt
# hoặc dùng live server:
npx serve .
```

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/villas` | Lấy tất cả villa |
| GET | `/api/villas?featured=true` | Villa nổi bật |
| GET | `/api/villas/:id` | Chi tiết một villa |
| GET | `/api/testimonials` | Đánh giá khách hàng |
| POST | `/api/booking` | Đặt phòng |
| GET | `/api/health` | Health check |

### Ví dụ POST /api/booking
```json
{
  "villaId": 1,
  "checkin": "2025-12-25",
  "checkout": "2025-12-30",
  "guests": 4,
  "name": "Nguyễn Văn A",
  "email": "email@example.com",
  "phone": "0901234567"
}
```

## 🏗 Kiến trúc

```
villa-rental/
├── frontend/
│   ├── index.html          # Single-page app (HTML + CSS + JS)
│   ├── nginx.conf          # Nginx config với proxy đến backend
│   └── Dockerfile
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml      # Orchestration
```

## 🎨 Công nghệ sử dụng

- **Frontend**: HTML5, CSS3 (custom properties, animations), Vanilla JS
- **Fonts**: Cormorant Garamond + Be Vietnam Pro (Google Fonts)
- **Backend**: Node.js + Express
- **Reverse Proxy**: Nginx
- **Containerization**: Docker + Docker Compose

## 📦 Mở rộng production

Để scale production, có thể thêm:
- **Database**: MongoDB hoặc PostgreSQL
- **Cache**: Redis cho sessions và API cache
- **CDN**: Cloudflare cho static assets
- **SSL**: Certbot/Let's Encrypt qua Nginx
- **Monitoring**: Grafana + Prometheus

```bash
# Scale backend instances
docker-compose up --scale backend=3
```
