# 🚀 Smart Queue Management System (SQMS)

An AI-powered queue management system designed for Banks, Hospitals, Government Offices, RTO Offices, and Passport Seva Centers.

## 🏗️ Architecture

```
Smart/
├── frontend/          # React + Tailwind CSS (Vite)
├── backend/           # Node.js + Express + MySQL
├── ai-service/        # Python FastAPI (ML predictions)
└── README.md
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Python 3.9+ (for AI service)
- Redis (optional, for caching)

### 1. Database Setup
```sql
CREATE DATABASE sqms_db;
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env   # Edit with your DB credentials
npm install
npm run dev             # Starts on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev             # Starts on port 5173
```

### 4. AI Service (Optional)
```bash
cd ai-service
pip install -r requirements.txt
python main.py          # Starts on port 8000
```

## 🔐 Demo Credentials

| Role  | Email           | Password |
|-------|-----------------|----------|
| Admin | admin@sqms.com  | admin123 |
| User  | user@sqms.com   | user123  |

## 🎯 Features

### 👤 User Panel
- ✅ Register/Login with JWT
- ✅ Browse and search branches
- ✅ Book tokens with estimated wait time
- ✅ Live queue tracking (auto-refresh)
- ✅ QR code for each token
- ✅ Cancel tokens
- ✅ SMS notifications (Twilio)
- ✅ Real-time updates (Socket.IO)

### 🏢 Admin Panel
- ✅ Dashboard with analytics charts
- ✅ Branch CRUD management
- ✅ Live queue control (call next, skip, complete)
- ✅ Counter assignment
- ✅ Hourly/weekly analytics
- ✅ Peak hour analysis
- ✅ Branch-wise stats

### 🤖 AI Features
- ✅ Linear Regression wait time prediction
- ✅ Peak hour factor calculation
- ✅ Batch prediction endpoint
- ✅ Model retraining API

## 🗄️ Database Schema

- **Users**: id, name, phone, email, password_hash, role
- **Branches**: id, name, location, type, total_counters, active_counters
- **Tokens**: id, user_id, branch_id, token_number, status, estimated_time
- **Queue Logs**: id, token_id, branch_id, actual_start/end_time, durations

## 🛠️ Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React, Tailwind CSS v4, Vite     |
| Backend    | Node.js, Express, Sequelize ORM  |
| Database   | MySQL, Redis (optional)          |
| Auth       | JWT (JSON Web Tokens)            |
| Real-time  | Socket.IO                        |
| SMS        | Twilio API                       |
| AI/ML      | Python FastAPI, scikit-learn     |
| Charts     | Recharts                         |

## 📱 Supported Branch Types
- 🏦 Banks (SBI, PNB, etc.)
- 🏥 Hospitals (Apollo, AIIMS, etc.)
- 🏛️ Government Offices
- 🚗 RTO Offices
- 🛂 Passport Seva Centers
