# Movie Ticket System — Event-Driven Architecture

## 1. Kiến trúc tổng quan

```
┌─────────────┐      ┌──────────────────────────────────────────────┐
│  Frontend   │      │              Backend (NestJS)                │
│  (React +   │ ───→ │  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  Tailwind)  │      │  │API       │  │User      │  │Movie      │ │
│  Port 5173  │      │  │Gateway   │  │Service   │  │Service    │ │
│             │      │  │Port 3000 │  │Port 3001 │  │Port 3002  │ │
└─────────────┘      │  └──────────┘  └──────────┘  └───────────┘ │
                     │  ┌──────────┐  ┌──────────────────────────┐ │
                     │  │Booking   │  │Payment + Notification    │ │
                     │  │Service   │  │Service                   │ │
                     │  │Port 3003 │  │Port 3004                 │ │
                     │  └────┬─────┘  └────────────┬─────────────┘ │
                     │       │    Redis PubSub      │               │
                     │       └──────────────────────┘               │
                     └──────────────────────────────────────────────┘
```

## 2. Tech Stack

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | NestJS (mỗi service 1 project riêng) |
| Message Broker | Redis PubSub |
| Database | MariaDB (TypeORM) |
| Auth | JWT |

## 3. Danh sách Service & Port

| Service | Port | Vai trò |
|---------|------|---------|
| API Gateway | 3000 | Proxy request từ Frontend → các service |
| User Service | 3001 | Đăng ký / đăng nhập, publish USER_REGISTERED |
| Movie Service | 3002 | GET/POST phim |
| Booking Service | 3003 | Tạo booking, publish BOOKING_CREATED |
| Payment + Notification | 3004 | Listen events, xử lý thanh toán & thông báo |

## 4. Danh sách Event

| Event | Mô tả | Publisher | Consumer |
|-------|--------|-----------|----------|
| USER_REGISTERED | Người dùng đăng ký | User Service | (Log) |
| BOOKING_CREATED | Tạo booking mới | Booking Service | Payment Service |
| PAYMENT_COMPLETED | Thanh toán thành công | Payment Service | Notification Service |
| BOOKING_FAILED | Thanh toán thất bại | Payment Service | Notification Service |

## 5. Luồng Event chính

```
1. User đăng ký → User Service → Publish "USER_REGISTERED"
2. User đăng nhập → Nhận JWT token
3. User chọn phim + ghế → Booking Service → Publish "BOOKING_CREATED"
4. Payment Service (listen BOOKING_CREATED) → Random success/fail
   → Publish "PAYMENT_COMPLETED" hoặc "BOOKING_FAILED"
5. Notification Service (listen PAYMENT_COMPLETED / BOOKING_FAILED)
   → Log thông báo "Booking #123 thành công!" hoặc "Booking #123 thất bại!"
```

## 6. API Endpoints

### User Service (Port 3001)
- `POST /users/register` — Đăng ký tài khoản
- `POST /users/login` — Đăng nhập, trả JWT

### Movie Service (Port 3002)
- `GET /movies` — Danh sách phim
- `POST /movies` — Thêm phim mới

### Booking Service (Port 3003)
- `POST /bookings` — Tạo booking (chọn phim + ghế)
- `GET /bookings` — Xem danh sách booking

### Payment + Notification (Port 3004)
- Không có API — chỉ listen event từ Redis

### API Gateway (Port 3000)
- Proxy tất cả request tới service tương ứng

## 7. Kịch bản Demo (BẮT BUỘC)

| Bước | Hành động | Kết quả mong đợi |
|------|-----------|-------------------|
| 1 | Đăng ký user mới (username, password) | Thành công + Console log: USER_REGISTERED |
| 2 | Đăng nhập với tài khoản vừa tạo | Nhận JWT token |
| 3 | Xem danh sách phim | Hiển thị danh sách phim trên UI |
| 4 | Chọn phim + nhập số ghế → Đặt vé | Booking created + Console log: BOOKING_CREATED |
| 5 | Payment Service xử lý tự động | Console log: PAYMENT_COMPLETED hoặc BOOKING_FAILED |
| 6 | Notification hiển thị kết quả | Console log: "Booking #123 thành công!" |
| 7 | Kiểm tra trạng thái booking | Booking cập nhật: CONFIRMED hoặc FAILED |

## 8. Cách chạy

```bash
# 1. Chạy Redis (cần cài Docker hoặc Redis Windows)
docker run -d -p 6379:6379 redis

# 2. Tạo database MariaDB
# Chạy trong MySQL/MariaDB client:
# CREATE DATABASE movie_ticket_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# Cấu hình: host=localhost port=3306 user=root password=root

# 3. Chạy từng service (mỗi terminal riêng)
cd backend/api-gateway && npm run start:dev
cd backend/user-service && npm run start:dev
cd backend/movie-service && npm run start:dev
cd backend/booking-service && npm run start:dev
cd backend/payment-notification-service && npm run start:dev

# 3. Chạy Frontend
cd frontend && npm run dev
```

## 9. Cấu trúc thư mục

```
Movie_Ticket_System/
├── README.md
├── backend/
│   ├── api-gateway/          (NestJS - Port 3000)
│   ├── user-service/         (NestJS - Port 3001)
│   ├── movie-service/        (NestJS - Port 3002)
│   ├── booking-service/      (NestJS - Port 3003)
│   └── payment-notification-service/ (NestJS - Port 3004)
└── frontend/                 (React + Tailwind - Port 5173)
```
