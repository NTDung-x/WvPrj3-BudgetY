src/
├── types/              # Chứa các interface/type TypeScript của ứng dụng
│   └── index.ts
├── services/           # Xử lý dữ liệu, tính toán và làm việc với localStorage
│   └── storage.ts
├── components/         # Các module render giao diện (HTML + gắn event listeners)
│   ├── Header.ts
│   ├── SummaryCards.ts # Thẻ tổng quan: Thu nhập, Chi tiêu, Số dư
│   ├── TransactionForm.ts
│   └── TransactionList.ts
├── utils/              # Các hàm bổ trợ (format tiền tệ, format ngày tháng)
│   └── formatters.ts
├── style.css           # File CSS chứa @import "tailwindcss"
└── main.ts             # Điểm vào chính, gắn kết các component vào #app
