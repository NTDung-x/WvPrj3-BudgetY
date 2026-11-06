Chuyển sang code để xem chi tiết cấu trúc



src/
├── types/ # Chứa các interface/type TypeScript của ứng dụng
│ └── index.ts
├── services/ # Xử lý dữ liệu, tính toán và làm việc với localStorage
│ ├── transManager # Nắm giữ trạng thái: Lưu trans, cats; đồng bộ local; tính toán
│ └── storage.ts
├── components/ # Các module render giao diện (HTML + gắn event listeners)
│ ├── Overview.ts
│ ├── TransDetails.ts 
│ └── TransAddDialog.ts
├── utils/ # Các hàm bổ trợ (format tiền tệ, format ngày tháng)
│ └── formatters.ts
├── style.css # File CSS chứa @import "tailwindcss"
└── main.ts # Điểm vào chính, gắn kết các component vào #app
