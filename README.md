# Movie Ticket System - 電影票務系統

## 專案簡介
Movie Ticket System 是一個簡單的電影票務管理系統，旨在幫助使用者管理電影資料並進行票務操作。系統採用了前後端分離的架構，並實現了完整的 CRUD 功能，使用 MongoDB 存儲電影資料。後端使用 Express 和 Node.js，前端則可根據需求進行擴展。

## 功能特色
### 基礎功能
- **電影資訊管理**（新增、編輯、刪除）
- **查詢電影資料**：列出所有電影的詳細資料。
- **電影海報顯示**：支持電影海報圖片的顯示。
  
### 系統架構
#### 前端 (Frontend)
- 框架: 可選 (例如：React、Vue.js)
- UI 框架: 可選 (例如：Bootstrap、Tailwind CSS)
- HTTP 客戶端: Fetch API 或 Axios
  
#### 後端 (Backend)
- 執行環境: Node.js
- 框架: Express.js
- 資料庫: MongoDB
- ODM: Mongoose
- 認證: 可選 (例如 JWT、無需認證)
  
### 系統需求
- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm >= 6.0.0
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）

## API 文件

### 電影資料管理
- **GET** `/api/movies` - 獲取所有電影資料
- **POST** `/api/movies` - 新增電影
- **DELETE** `/api/movies/:id` - 刪除電影

### 系統啟動
#### 安裝後端依賴
```bash
cd backend
npm install
