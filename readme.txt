📁 Project Folder Structure 
project-root/
├── client/ (React App)
├── server/ (Node.js + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
└── database/
    └── MongoDB collections (invoices, products, users, transactions, etc.)



src/
 ├── main.jsx          ← entry point (already set by vite)
 ├── App.jsx           ← routing setup yahan karenge
 ├── pages/
 │        
 └── components/       

-----------------------------------------------------------------------------------
🔧 Technology Stack (MERN):
Frontend: React.js (with Tailwind CSS ya Material UI)

Backend: Node.js with Express

Database: MongoDB (NoSQL, flexible & fast)

PDF Handling: pdfkit or html-pdf

Authentication: JWT

Date/Time & Financial Libs: moment.js, currency.js

✅ Application Features (Like CA Services)
1. Authentication (Login/Signup) [COMPLETED]
Owner login with role-based access (admin/accountant)

2. Dashboard [COMPLETED]
Total sales, GST collected, pending payments

Bar/pie chart of 6-month growth (using chart.js or recharts)

3. Customer & Supplier Management [COMPLETED]
Add/Edit/Delete/View customers/suppliers

Show current balance (debit/credit)

Ledger-style transaction history

4. Product Management [COMPLETED]
Add/Edit/Delete products

Track stock & unit price

Auto stock deduction on invoice

5. Invoice System [COMPLETED]
Generate GST invoice (CGST, SGST, IGST)

PDF export [COMPLETED]

Invoice listing, search, filter

Print invoice feature [COMPLETED]

6. Purchase Entry [COMPLETED]
Record supplier purchases

GST input handling (for setoff)

Update stock on purchase

7. GST Reports
Monthly/Quarterly report

GST Input vs Output

Downloadable in PDF/Excel format

8. Ledger Reports
For each customer/supplier

Opening balance, credit/debit transactions

Closing balance

9. Expense Tracker
Add monthly expenses (rent, salary, electricity)

Auto add to profit/loss calculation

10. Profit & Loss Report
Monthly or date range

Total sales - purchases - expenses = profit
