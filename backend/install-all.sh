#!/bin/bash

# Hiển thị thông báo bắt đầu
echo "===== Installing dependencies for all microservices ====="

# Danh sách các thư mục service (đã bỏ tiền tố apps/)
services=(
  "user-service" 
  "movie-service" 
  "booking-service" 
  "api-gateway" 
  "payment-notification-service"
)

# Lấy đường dẫn thư mục hiện tại của script
BASE_DIR=$(pwd)

for service in "${services[@]}"; do
  echo "----------------------------------------------------"
  echo ">>> Processing: $service"
  
  # Kiểm tra xem thư mục có tồn tại không trước khi cd
  if [ -d "$service" ]; then
    cd "$service" && npm install
    # Quay trở lại thư mục gốc ban đầu
    cd "$BASE_DIR"
  else
    echo " [ERROR] Directory '$service' not found! Skipping..."
  fi
done

echo "----------------------------------------------------"
echo "===== All dependencies installed successfully! ====="