# College Management Information System (CMIS)

A comprehensive software system developed for universities and colleges to maintain information associated with various daily activities within the institution.

## 🎯 **Problem Statement**

CMIS is designed to manage details of various departments, courses offered, student admissions, faculty details, day-to-day attendance, salary details, exam marks, internal marks, laboratory infrastructure, and more. The system generates reports helpful for office staff, faculty, principal, HODs, and management administration. It also facilitates communication with parents about student progress and status.

## 🚀 **Features**

### **Core Modules**
- ✅ **User Management** - Registration, Login, Role-based Access Control
- ✅ **Student Management** - Admission, Profile, Enrollment
- ✅ **Course Management** - Departments, Courses, Subjects
- ✅ **Attendance Tracking** - Daily attendance records
- ✅ **Exam Management** - Exams, Grades, Results
- ✅ **Fee Management** - Fee collection, payment tracking
- ✅ **Timetable Management** - Class schedules, room allocation

### **User Roles**
- **ADMIN** - Full system access and management
- **STAFF** - Academic and administrative operations
- **STUDENT** - Personal information and academic records

## 🛠 **Technology Stack**

### **Backend**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **Validation**: Zod schema validation
- **Logging**: Pino with pretty formatting
- **Documentation**: Swagger/OpenAPI 3.0

### **Database**
- **Type**: PostgreSQL (Relational)
- **ORM**: Prisma Client
- **Migrations**: Automatic schema management

## 📋 **Prerequisites**

- Node.js 18+ and npm
- PostgreSQL 14+
- Docker (optional, for containerized setup)

## 🚀 **Quick Start**

### **1. Clone and Setup**
```bash
git clone <repository-url>
cd CMIS
```

### **2. Backend Setup**
```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/cmis"
JWT_SECRET="your-secret-key"
PORT=4000
NODE_ENV=development
```

### **3. Database Setup**
```bash
# Start PostgreSQL (if using Docker)
docker compose up -d db

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### **4. Start Backend Server**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 📚 **API Documentation**

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:4000/api-docs
- **Health Check**: http://localhost:4000/health

### **API Endpoints**

#### **Authentication**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

#### **Students**
- `GET /api/v1/students` - List students
- `POST /api/v1/students` - Create student
- `GET /api/v1/students/:id` - Get student details

#### **Courses**
- `GET /api/v1/courses` - List courses
- `POST /api/v1/courses` - Create course
- `GET /api/v1/courses/:id` - Get course details

#### **Fees**
- `GET /api/v1/fees` - List fees
- `POST /api/v1/fees` - Create fee record
- `POST /api/v1/fees/:id/pay` - Record payment

#### **Exams & Grades**
- `GET /api/v1/exams` - List exams
- `POST /api/v1/exams` - Create exam
- `POST /api/v1/exams/:id/grades` - Add/update grades

#### **Attendance**
- `GET /api/v1/attendance` - List attendance records
- `POST /api/v1/attendance` - Mark attendance

## 🔐 **Security Features**

- **JWT Authentication** with configurable expiry
- **Role-based Access Control** (RBAC)
- **Input Validation** using Zod schemas
- **SQL Injection Protection** via Prisma ORM
- **CORS Configuration** for cross-origin requests
- **Environment-based Configuration**

## 📊 **Database Schema**

The system uses a relational database with the following key entities:

- **Users** - Authentication and role management
- **Students** - Student information and profiles
- **Courses** - Academic course structure
- **Departments** - Organizational structure
- **Subjects** - Course content management
- **Enrollments** - Student-course relationships
- **Attendance** - Daily attendance tracking
- **Exams** - Assessment management
- **Grades** - Student performance records
- **Fees** - Financial management
- **Timetable** - Class scheduling

## 🧪 **Testing**

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 **Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT token expiry | `7d` |

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker compose up -d

# Production build
docker build -t cmis-backend .
docker run -p 4000:4000 cmis-backend
```

### **Manual Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 **Project Structure**

```
CMIS/
├── server/                 # Backend application
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── types.ts       # TypeScript type definitions
│   │   ├── db.ts          # Database connection
│   │   ├── swagger.ts     # API documentation
│   │   └── index.ts       # Main application entry
│   ├── prisma/            # Database schema and migrations
│   ├── package.json       # Dependencies and scripts
│   └── docker-compose.yml # Database services
├── client/                # Frontend application (React)
└── README.md             # This file
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Email: support@cmis.edu

## 🔄 **API Versioning**

The API uses semantic versioning with the current version being **v1**. All endpoints are prefixed with `/api/v1/`.

## 📈 **Performance & Monitoring**

- **Request Logging** with Pino logger
- **Error Tracking** with detailed error messages
- **Database Connection Pooling** via Prisma
- **Response Time Monitoring** built-in

---

**Built with ❤️ for educational institutions**
