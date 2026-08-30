# CityPulse AI 🚦  
### AI-Powered Civic Infrastructure Management System

CityPulse AI is a smart civic complaint and infrastructure monitoring platform built to help citizens report urban issues such as potholes, open manholes, garbage piles, damaged roads, and other public infrastructure problems.  

The system uses **YOLOv8s computer vision**, **Gemini AI analysis**, and a **role-based admin dashboard** to classify complaints, estimate public risk, route issues to the correct department, and help authorities respond faster.

---

## 🚀 Project Overview

Traditional civic complaint systems usually depend on manual review, slow routing, and user-selected priority levels. CityPulse AI improves this process by using AI to analyze both complaint text and uploaded images.

Citizens can submit complaints with images, and the system automatically generates:

- Civic issue category
- Priority level
- Risk score
- Responsible department
- AI explanation
- YOLO-based visual detection
- Complaint tracking status

---

## 🎯 Problem Statement

Urban infrastructure problems like potholes, open manholes, garbage accumulation, damaged roads, and drainage issues can create safety risks for citizens. Manual complaint handling often leads to delayed response, poor prioritization, and lack of transparent tracking.

CityPulse AI solves this by creating an AI-powered platform where complaints are automatically analyzed, prioritized, and routed to the appropriate department.

---

## ✨ Key Features

### 👤 Citizen Features

- Citizen registration and login
- Submit civic complaints
- Upload image evidence
- Track complaint status
- View AI-generated category, priority, department, and explanation
- Delete own complaints

### 🛡️ Admin / Officer Features

- View all citizen complaints
- See citizen contact details
- View uploaded image evidence
- View YOLO and Gemini AI analysis
- Update complaint status
- Cannot submit citizen complaints
- Cannot delete complaints

### 🤖 AI Features

- YOLOv8s image detection
- Gemini-based complaint analysis
- Risk scoring
- Priority classification
- Department routing
- Rule-based safety validation
- Text-image conflict handling

---

## 🧠 AI Pipeline

```text
Citizen Complaint + Image
        ↓
YOLOv8s detects civic issue
        ↓
Gemini analyzes text + image + YOLO result
        ↓
Rule-based safety validator checks final risk
        ↓
Final category, priority, department, and risk score
        ↓
Complaint stored in MongoDB
        ↓
Admin dashboard displays actionable complaint
```

---

## 🧩 YOLOv8s Detection Classes

The trained YOLOv8s model currently detects:

```text
pothole
road_damage
open_manhole
garbage
```

The YOLO model works as an optional visual evidence layer. Gemini still performs final reasoning and generates the final complaint analysis.

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Cloudinary
- Gemini API

### AI / Computer Vision

- Python
- FastAPI
- YOLOv8s
- Ultralytics
- Pillow

### Tools

- Git & GitHub
- VS Code
- Postman
- Google Colab
- MongoDB Atlas
- Cloudinary

---

## 📁 Project Structure

```text
CityPulse-AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── helpers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend-1/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── main.jsx
│   └── package.json
│
├── yolo-service/
│   ├── app.py
│   ├── requirements.txt
│   └── models/
│       └── best.pt
│
├── README.md
└── .gitignore
```

---

## 🔐 Role-Based Access

| Feature | Citizen | Admin / Officer |
|---|---:|---:|
| Register/Login | ✅ | ✅ |
| Submit Complaint | ✅ | ❌ |
| View Own Complaints | ✅ | ✅ |
| View All Complaints | ❌ | ✅ |
| View Citizen Contact Details | ❌ | ✅ |
| Update Complaint Status | ❌ | ✅ |
| Delete Complaint | ✅ Own only | ❌ |
| AI Analysis View | ✅ | ✅ |

---

## 🛠️ Backend Setup

### 1. Go to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key
YOLO_SERVICE_URL=http://localhost:8000

ALLOW_ADMIN_CREATION=true
```

### 4. Run backend server

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## 🤖 YOLO Service Setup

### 1. Go to YOLO service folder

```bash
cd yolo-service
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

For Windows:

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Add YOLO model

Place the trained model here:

```text
yolo-service/models/best.pt
```

### 6. Run YOLO service

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

YOLO service will run on:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/
```

---

## 💻 Frontend Setup

### 1. Go to frontend folder

```bash
cd frontend-1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run frontend

```bash
npm run dev -- --force
```

Frontend will run on:

```text
http://localhost:5173
```

---

## ▶️ Running the Complete Project

Run services in this order:

### 1. Start YOLO service

```bash
cd yolo-service
venv\Scripts\activate
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start backend

```bash
cd backend
npm run dev
```

### 3. Start frontend

```bash
cd frontend-1
npm run dev -- --force
```

---

## 📌 Main API Routes

### Auth Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register citizen |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get logged-in profile |
| POST | `/api/auth/create-demo-admin` | Create demo admin account |

### Complaint Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/complaints` | Citizen | Submit complaint |
| GET | `/api/complaints` | Citizen | Get own complaints |
| GET | `/api/complaints/admin/all` | Admin/Officer | Get all complaints |
| GET | `/api/complaints/:id` | Citizen/Admin | Get single complaint |
| PATCH | `/api/complaints/:id/status` | Admin/Officer | Update complaint status |
| DELETE | `/api/complaints/:id` | Citizen | Delete own complaint |

### YOLO Route

| Method | Endpoint | Description |
|---|---|---|
| POST | `/detect` | Detect civic issue from uploaded image |

---

## 🧪 Demo Complaints

Use these examples for testing:

### Open Manhole

```text
Title:
Open manhole on busy road

Description:
There is an open manhole in the middle of a busy road. It is dangerous for pedestrians and two-wheelers, especially at night.
```

Expected:

```text
Category: Drainage
Priority: Critical
Department: Water Department
Risk Score: 86+
```

### Large Pothole

```text
Title:
Large pothole on main road

Description:
A large pothole has formed on the main road near the market area. Two-wheelers may lose balance and accidents may happen during rain.
```

Expected:

```text
Category: Roads
Priority: High / Critical
Department: Public Works
Risk Score: 78+
```

### Garbage Near School

```text
Title:
Garbage pile near school gate

Description:
A large garbage pile is present near the school gate. Students pass through this area daily and it may create hygiene and health problems.
```

Expected:

```text
Category: Garbage
Priority: High
Department: Sanitation Department
Risk Score: 58+
```

---

## 🧠 Risk Scoring Logic

| Risk Score | Priority | Meaning |
|---:|---|---|
| 0–25 | Low | Minor issue, no immediate danger |
| 26–50 | Medium | Needs attention, low immediate risk |
| 51–75 | High | Unsafe condition, possible injury or disruption |
| 76–100 | Critical | Immediate public safety danger |

---

## 📊 Admin Dashboard

The admin dashboard shows:

- Total complaints
- Pending complaints
- Resolved complaints
- Critical complaints
- Priority distribution chart
- Category distribution chart
- Citizen contact details
- Uploaded image preview
- AI risk score
- AI explanation
- Status update dropdown

---

## 🔮 Future Improvements

- Add waterlogging detection
- Add broken streetlight detection
- Add map-based complaint hotspots
- Add SMS/email notifications
- Add authority assignment workflow
- Add complaint escalation system
- Add analytics for recurring civic issues
- Deploy backend, frontend, and YOLO service online

---

## 🏆 Project Highlights

- Full-stack working MVP
- Role-based access control
- AI-powered complaint classification
- YOLOv8s visual detection
- Gemini-based reasoning
- MongoDB complaint tracking
- Admin status management
- Professional smart-city use case

---

## 📄 License

This project is built for academic, hackathon, and demonstration purposes.

---

## ⭐ Final Note

CityPulse AI is not just a complaint registration portal. It is an AI-powered civic infrastructure intelligence system that helps citizens report problems and helps authorities prioritize issues based on real safety impact.
