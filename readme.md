# Railway FIR Management System

## Project Overview

**Railway FIR Management System** is a comprehensive web application designed to manage First Information Reports (FIRs) for the Bihar Railway Police. This system facilitates the registration, tracking, and management of criminal cases reported at railway stations across the network. The application provides role-based access for both administrators and investigating officers with features for case management, suspect tracking, bail management, and analytical reporting.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Important Code Files](#important-code-files)
- [Deployment](#deployment)

---

## Features

### 👮 Admin Features
- **Dashboard**: Real-time analytics and FIR statistics across all districts
- **Smart Search**: Advanced search functionality with filters (district, status, date range, etc.)
- **Reports Generation**: Generate and view detailed reports on case statistics
- **User Management**: Manage admin and officer accounts
- **System Overview**: Monitor system health and performance

### 👨‍💼 Officer Features
- **FIR Registration**: Add new FIR cases with comprehensive details
- **Bulk Upload**: Upload multiple FIRs via CSV file
- **FIR Management**: View, edit, and manage filed FIRs
- **Accused Management**: Track and manage accused individuals (name, age, address, etc.)
- **Bail Management**: Record and track bail information for accused persons
- **Case Status Tracking**: Monitor case progression (Registered → Investigation → Closed)
- **Profile Management**: Update personal profile and credentials

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication system
- **Password Encryption**: Bcrypt password hashing for user security
- **Role-Based Access Control (RBAC)**: Different access levels for Admin and Officer roles
- **Protected Routes**: Middleware protection for sensitive endpoints
- **Token Validation**: Automatic token verification on each request

---

## Tech Stack

### Backend
- **Runtime**: Node.js (18.x, 19.x, 20.x)
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM 8.0.3
- **Authentication**: JWT (jsonwebtoken 9.0.3) + Bcryptjs 2.4.3
- **File Upload**: Multer 2.1.1
- **Data Parsing**: csv-parser 3.2.1
- **CORS**: cors 2.8.5
- **Environment**: dotenv 16.3.1
- **Development**: Nodemon (for hot-reload)

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.15.1
- **Styling**: Tailwind CSS 4.3.0
- **State Management**: Zustand 4.5.0
- **Animations**: Framer Motion 12.40.0
- **UI Icons**: Lucide React 1.16.0
- **Notifications**: React Hot Toast 2.6.0
- **Charts**: Recharts 3.8.1
- **Linting**: ESLint 9.36.0

### Deployment
- **Frontend**: Vercel (SPA deployment)
- **Backend**: Railway/Render (Node.js hosting)
- **Database**: MongoDB Cloud (Atlas)

---

## Project Architecture

### Directory Structure

```
railway-fir-management-system/
├── backend/                          # Node.js/Express Backend
│   ├── models/                       # MongoDB Database Models
│   │   ├── User.js                   # User schema (admin/officer)
│   │   ├── FIR.js                    # Main FIR schema
│   │   ├── Accused.js                # Accused person schema
│   │   ├── Bailer.js                 # Bail information schema
│   │   ├── District.js               # District information
│   │   └── Thana.js                  # Police station (Thana) data
│   │
│   ├── controllers/                  # Business Logic
│   │   ├── authController.js         # Login/Register logic
│   │   ├── admindashboardController.js  # Admin dashboard data
│   │   ├── officerdashboardController.js # Officer dashboard data
│   │   └── searchController.js       # Smart search functionality
│   │
│   ├── routes/                       # API Endpoints
│   │   ├── authRoutes.js             # Auth endpoints (/api/auth)
│   │   ├── dashboardRoutes.js        # Dashboard endpoints
│   │   ├── searchRoutes.js           # Search endpoints
│   │   └── officerRoutes.js          # Officer CRUD operations
│   │
│   ├── config/                       # Configuration Files
│   │   └── db.js                     # MongoDB connection setup
│   │
│   ├── authMiddleware.js             # JWT verification middleware
│   ├── server.js                     # Main Express server
│   ├── package.json                  # Dependencies
│   └── .env                          # Environment variables
│
├── frontend/                         # React SPA Frontend
│   ├── src/
│   │   ├── pages/                    # Page components
│   │   │   └── Login.jsx             # Login authentication page
│   │   │
│   │   ├── admin/                    # Admin dashboard pages
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx     # Admin analytics dashboard
│   │   │   │   ├── SmartSearch.jsx   # Advanced FIR search
│   │   │   │   └── Reports.jsx       # Report generation
│   │   │   └── components/
│   │   │       └── MyProfile.jsx     # Profile management
│   │   │
│   │   ├── officer/                  # Officer portal pages
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx     # Officer dashboard
│   │   │   │   ├── AddFIR.jsx        # Register new FIR
│   │   │   │   ├── FIRList.jsx       # View all FIRs
│   │   │   │   ├── FIRView.jsx       # Detailed FIR view
│   │   │   │   ├── FIREdit.jsx       # Edit FIR details
│   │   │   │   ├── AccusedList.jsx   # Manage accused persons
│   │   │   │   ├── BailList.jsx      # Bail records
│   │   │   │   ├── BulkUploadFIR.jsx # CSV bulk import
│   │   │   │   └── OfficerProfile.jsx # Officer profile
│   │   │   └── components/           # Reusable components
│   │   │
│   │   ├── App.jsx                   # Main routing component
│   │   ├── ProtectedRoute.jsx        # Role-based route protection
│   │   ├── api.js                    # API client with token handling
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── public/                       # Static assets
│   ├── vite.config.js                # Vite build configuration
│   ├── eslint.config.js              # Code linting rules
│   ├── package.json                  # Frontend dependencies
│   └── vercel.json                   # Vercel deployment config
│
├── package.json                      # Root package.json (scripts)
└── README.md                         # This file

```

---

## Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- MongoDB database (local or MongoDB Atlas cloud)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/zeyaul98/FIR-MANAGMENT-SYSTEM.git
cd railway\ FIR
```

### Step 2: Install All Dependencies
```bash
# Install root dependencies and both backend & frontend
npm run install-all

# OR manually:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 3: Configure Environment Variables

**Backend (.env file)**
```
# Create backend/.env file with:
NODE_ENV=development
PORT=5000
HOST=0.0.0.0
MONGO_URI=mongodb://localhost:27017/railway-fir
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env.local file)**
```
# Create frontend/.env.local file with:
VITE_API_URL=http://localhost:5000
```

### Step 4: Start Development Server

**Option A: Run Backend and Frontend Separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option B: Run Both Concurrently**
```bash
npm run dev
```

### Step 5: Access the Application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API Health Check: `http://localhost:5000/health`

---

## Usage

### Login
1. Navigate to http://localhost:5173/login
2. Enter credentials for admin or officer account
3. JWT token is automatically stored in localStorage

### For Admin Users
- View analytics and statistics from Dashboard
- Use Smart Search to filter FIRs by district, status, date range, officer, etc.
- Generate detailed reports on case statistics
- Manage user accounts

### For Officer Users
- Create new FIR cases (single or bulk upload)
- Add and manage accused individuals associated with FIRs
- Record bail information
- Edit case status and details
- View all filed FIRs and track investigation progress

---

## API Documentation

### Authentication Endpoints
```
POST /api/auth/login        - User login (username/password)
POST /api/auth/register     - Register new officer/admin
```

### Dashboard Endpoints
```
GET  /api/dashboard/admin   - Admin dashboard statistics
GET  /api/dashboard/officer - Officer dashboard statistics
```

### Search Endpoints
```
GET  /api/search/firs       - Search/filter FIRs with various criteria
GET  /api/search/fir/:id    - Get single FIR details
```

### Officer CRUD Endpoints
```
GET    /api/officer/firs           - Get all FIRs
POST   /api/officer/fir/new        - Create new FIR
GET    /api/officer/fir/:id        - Get FIR details
PUT    /api/officer/fir/:id        - Update FIR
DELETE /api/officer/fir/:id        - Delete FIR

GET    /api/officer/accused/:firId - Get accused in FIR
POST   /api/officer/accused/new    - Add accused person
PUT    /api/officer/accused/:id    - Update accused
DELETE /api/officer/accused/:id    - Delete accused

GET    /api/officer/bail/:firId    - Get bail records
POST   /api/officer/bail/new       - Record bail
PUT    /api/officer/bail/:id       - Update bail
DELETE /api/officer/bail/:id       - Delete bail
```

---

## Database Models

### User Model
```javascript
{
  name: String (required),
  username: String (unique, required),
  password: String (hashed with bcryptjs),
  role: String (enum: ["admin", "officer"]),
  timestamps: true
}
```

### FIR Model
```javascript
{
  firNumber: String (unique, required),
  state: String,
  zone: String,
  district: ObjectId (ref: District),
  thana: ObjectId (ref: Thana),
  dateOfIncident: Date (required),
  dateOfRegistration: Date,
  trainNo: String,
  trainName: String,
  stationCode: String,
  stationName: String,
  sections: String,
  description: String (required),
  itemLooted: String,
  modusOperandi: String,
  status: String (enum: ["registered", "investigation", "closed"]),
  ioName: String (Investigating Officer name),
  ioMobile: String,
  lawyerName: String,
  lawyerEmail: String,
  accused: [ObjectId] (refs: Accused),
  bailers: [ObjectId] (refs: Bailer),
  totalAccused: Number,
  bailed: Number,
  inCustody: Number,
  attachment: String (file path),
  timestamps: true
}
```

### Accused Model
```javascript
{
  firId: ObjectId (ref: FIR, required),
  officerId: ObjectId (ref: User, required),
  name: String (required),
  fatherName: String,
  age: Number (required),
  gender: String (enum: ["male", "female", "other"]),
  dob: Date,
  caste: String,
  religion: String,
  nationality: String,
  address: String,
  crpc Section: String,
  timestamps: true
}
```

### Bailer Model
```javascript
{
  firId: ObjectId (ref: FIR, required),
  name: String (required),
  relation: String,
  address: String,
  amount: Number,
  bailDate: Date,
  timestamps: true
}
```

### District & Thana Models
- Store geographic and administrative division data
- Referenced by FIR for location hierarchy

---

## Important Code Files

### 1. **Backend Core Files**

#### authMiddleware.js
- **Purpose**: JWT token verification and role-based access control
- **Key Functions**:
  - `verifyToken()`: Validates JWT tokens from request headers
  - `verifyRole()`: Checks if user has required role for endpoint
- **Used In**: All protected API routes

#### server.js
- **Purpose**: Main Express application setup and configuration
- **Key Features**:
  - CORS enabled for frontend communication
  - Static file serving for React SPA
  - Database connection
  - Route mounting
  - Health check endpoint

#### models/FIR.js
- **Purpose**: Defines FIR database schema
- **Key Fields**: 70+ fields covering railway crime data
- **References**: District, Thana, Accused, Bailer, User collections

### 2. **Frontend Core Files**

#### api.js
- **Purpose**: Centralized API client for all backend communications
- **Key Features**:
  - Automatic JWT token injection in headers
  - Error handling and validation
  - FormData support for file uploads
  - Environment-based URL configuration
- **Usage**: Imported in all API-calling components

#### ProtectedRoute.jsx
- **Purpose**: Protects routes based on user role
- **Logic**: Checks localStorage token and user role, redirects if unauthorized

#### App.jsx
- **Purpose**: Main routing configuration
- **Routes**:
  - `/login` - Public login page
  - `/admin/*` - Protected admin pages
  - `/officer/*` - Protected officer pages
- **Protected With**: ProtectedRoute wrapper

---

## Deployment

### Deploy to Railway/Render (Backend)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Secure secret key
   - `NODE_ENV`: production
   - `PORT`: 5000
4. Deploy automatic or manual

### Deploy to Vercel (Frontend)

1. Connect repository to Vercel
2. Configure build:
   - Build Command: `npm install && npm run build`
   - Output Directory: `frontend/dist`
3. Set environment variable:
   - `VITE_API_URL`: Backend API URL
4. Deploy

### Docker Deployment (Optional)

Create Dockerfile for containerization and deploy using Docker.

---

## Development Scripts

### Root Level (package.json)
```bash
npm run install-all      # Install all dependencies
npm run dev              # Run backend & frontend concurrently
npm run dev:backend      # Run backend only
npm run dev:frontend     # Run frontend only
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint on frontend
```

### Backend Scripts
```bash
npm run dev              # Start with nodemon (hot-reload)
npm start                # Start production server
```

### Frontend Scripts
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview built app
npm run lint             # Run ESLint
```

---

## Key Features Implementation

### 1. **JWT Authentication System**
- User login generates JWT token stored in localStorage
- Token included in all API requests via Authorization header
- `authMiddleware.js` validates token on protected routes
- Automatic redirect to login if token expires

### 2. **Role-Based Access Control**
- Two roles: Admin and Officer
- `ProtectedRoute` component enforces role-based access
- Backend middleware (`verifyRole`) prevents unauthorized data access
- Different UI/pages shown based on role

### 3. **CSV Bulk Import**
- Officers can upload CSV file with multiple FIRs
- `csv-parser` processes file
- Validates and inserts bulk data into database

### 4. **Advanced Search**
- Filter FIRs by: district, thana, status, date range, officer, etc.
- Real-time filtering without page reload
- Displays matching results with details

### 5. **Case Status Tracking**
- Registered → Investigation → Closed
- Status displayed in FIR records
- Used for analytics and reporting

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=3000 npm run dev:backend
```

### MongoDB Connection Error
- Verify MONGO_URI is correct
- Check network access in MongoDB Atlas
- Ensure MongoDB service is running

### CORS Error
- Backend has CORS enabled for all origins
- Check API_URL in frontend matches backend URL

### Token Issues
- Clear localStorage: `localStorage.clear()`
- Try re-login
- Check JWT_SECRET matches in backend

---

## Future Enhancements
- SMS/Email notifications for case updates
- Mobile app version
- Advanced analytics dashboard
- Case document management
- Police-to-court integration
- Real-time case tracking for complainants

---

## Support & Contribution
For issues, suggestions, or contributions, please contact the development team.

---

## License
ISC License

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Status**: Production Ready
