<<<<<<< HEAD
# FinTaxPro - Business Management System

A comprehensive, full-stack web application designed to streamline business operations, including inventory management, sales, purchases, and financial tracking. Built with the MERN stack (MongoDB, Express, React, Node.js) and styled with a modern "Blue Monochrome" design system using Tailwind CSS.

## 🚀 Key Features

### 📊 Advanced Dashboard

- **Real-time Statistics**: View total sales, purchases, expenses, and net profit at a glance.
- **Stock Overview**: Visual indicators for stock levels (Green > 50, Orange < 50, Red < 10).
- **Charts**: Interactive graphs for sales trends and expense breakdowns.

### 📦 Inventory Management

- **Product Tracking**: Manage products with SKU, HSN, and tax details.
- **Stock Adjustments**: Manually increase or decrease stock with reason tracking.
- **Low Stock Alerts**: Automatic notifications for items running low.

### 💰 Sales & Purchases

- **Invoicing**: Generate professional GST-compliant invoices.
- **PDF Export**: Instant PDF generation and download for invoices.
- **Ledgers**:
  - **Customer Ledgers**: Track sales history and outstanding payments for clients.
  - **Supplier Ledgers**: Monitor purchase history and net payable amounts to vendors.

### 👥 Client & Supplier Management

- **Directories**: Maintain detailed databases of clients and suppliers.
- **Transaction History**: View complete financial history for every contact.

### 🔐 Security & Settings

- **Authentication**: Secure JWT-based login and registration.
- **Password Reset**: Email-based password recovery using SendGrid.
- **Company Profile**: Dynamic configuration of company details for invoices.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Tools**: Axios, Recharts, html2pdf.js, SendGrid

## ⚙️ Installation & Setup

### Prerequisites

- Node.js installed
- MongoDB installed and running locally or a MongoDB Atlas URI

### 1. Backend Setup
=======
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
>>>>>>> 7b23b7553b3487d1c405db3d08e56ea9245750a5

```bash
cd backend
npm install
```

<<<<<<< HEAD
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/FinTaxPro
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sender_email
```

Run the server:
=======
Create a `.env` inside backend:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_email
```

Run server:
>>>>>>> 7b23b7553b3487d1c405db3d08e56ea9245750a5

```bash
npm run dev
```

<<<<<<< HEAD
### 2. Frontend Setup
=======
---

### 2️⃣ Frontend Setup
>>>>>>> 7b23b7553b3487d1c405db3d08e56ea9245750a5

```bash
cd client
npm install
<<<<<<< HEAD
```

Run the client:

```bash
npm run dev
```

## 📄 License

This project is licensed under the MIT License.
=======
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
>>>>>>> 7b23b7553b3487d1c405db3d08e56ea9245750a5
