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

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/FinTaxPro
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sender_email
```

Run the server:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Run the client:

```bash
npm run dev
```

## 📄 License

This project is licensed under the MIT License.
