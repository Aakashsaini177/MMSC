# 📊 MMSC – Multi-Module Smart Management System

A powerful MERN-based business management platform that automates daily operations such as sales, purchases, inventory, GST filing, client management, and tax reporting.  
Designed for accountants, GST practitioners, wholesalers, and small/medium businesses.

---

## 🚀 Key Features

### 📊 Dashboard
- Real-time Sales, Purchases, Profit, Expenses  
- Stock Overview with color indicators  
- Monthly Sales Trend Graph  
- Expense Pie Chart  
- Low Stock Alerts  
- Recent Activity Feed  

---

## 📦 Inventory & Product Management
- Add/Edit/Delete Products  
- Live Stock Management  
- Purchase Price & Selling Price support  
- Auto stock updates:  
  - Purchase → Stock Increase  
  - Sales → Stock Decrease  
- HSN & GST rate support  
- Inventory Valuation Reports  

---

## 💰 Sales & Purchase Modules

### 🧾 Sales
- Create GST-compliant invoices  
- Auto stock deduction  
- Profit per invoice  
- PDF invoice generation (html2pdf.js)

### 📥 Purchase
- Supplier-based purchases  
- Auto stock addition  
- Input GST credit calculation  

---

## 👥 Client & Supplier Management
- Maintain detailed client & supplier directory  
- GSTIN, address, balances  
- Auto ledger updates  
- Sales & Purchase history  
- Outstanding balance summary  

---

## 📄 Document Manager
- Upload & store PDF/JPG/PNG files  
- Drag-and-drop upload  
- Preview & Download support  

---

## 🧾 GST Filing Module
- **GSTR-1 Summary**  
  - B2B  
  - B2C Large/Small  
  - HSN Summary  
- **GSTR-3B Calculation**  
  - Output GST  
  - Input GST (ITC)  
  - Net GST payable  
- Downloadable Reports (coming soon)

---

## 💹 Tax Return Module
- Profit & Loss Report  
- Gross & Net Profit calculation  
- Monthly/Yearly summaries  

---

## 🔐 Authentication & Settings
- Secure JWT Login/Register  
- Forgot/Reset Password  
- Company Profile for invoices  
- Email system (SendGrid)  

---

## 🛠 Tech Stack

### Frontend
- React.js  
- Vite  
- Tailwind CSS  
- Recharts  
- Axios  
- html2pdf.js  

### Backend
- Node.js  
- Express.js  
- Multer (file uploads)  
- JWT Authentication  

### Database
- MongoDB (Mongoose)

---

## ⚙️ Installation & Setup

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` inside backend:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_email
```

Run server:

```bash
npm run dev
```

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 📂 Folder Structure

```
MMSC/
 ├── backend/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middleware/
 │   ├── uploads/
 │   └── Server.js
 │
 ├── client/
 │   ├── src/
 │   │   ├── pages/
 │   │   ├── components/
 │   │   ├── context/
 │   │   └── routes/
 │   └── public/
 │
 ├── .gitignore
 ├── README.md
 └── package.json
```

---

## 🧪 Testing Checklist
- Purchase adds stock  
- Sale reduces stock  
- GST Input vs Output calculation  
- Ledger updates correctly  
- Invoice PDF prints  
- Low stock alerts trigger  

---

## 📄 License
MIT License
