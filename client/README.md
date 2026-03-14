# CMIS Frontend - React Application

A modern, responsive React frontend for the College Management Information System (CMIS).

## 🚀 Features

### ✅ **Core Features Implemented**
- **Authentication System**: Login/Register with JWT tokens
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Zod schema validation with react-hook-form
- **Routing**: Protected routes with React Router
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, professional interface with Lucide icons

### 🎯 **Pages & Modules**
- **Dashboard**: Overview with statistics and quick actions
- **Students**: Full CRUD operations with search and filtering
- **Courses**: Course management (placeholder)
- **Departments**: Department management (placeholder)
- **Fees**: Fee management (placeholder)
- **Exams**: Exam and grade management (placeholder)
- **Attendance**: Attendance tracking (placeholder)
- **Timetable**: Schedule management (placeholder)

### 🛠 **Technical Features**
- **State Management**: React hooks for local state
- **API Integration**: Axios-based service layer
- **Error Handling**: User-friendly error messages
- **Loading States**: Skeleton loaders and spinners
- **Responsive Navigation**: Mobile-friendly sidebar
- **Form Management**: Controlled forms with validation

## 🏗 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Authentication guard
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   ├── Students.tsx    # Student management
│   └── ...            # Other module pages
├── services/           # API and external services
│   └── api.ts         # API service layer
├── types/              # TypeScript type definitions
│   └── index.ts       # All application types
├── App.tsx            # Main application component
├── index.css          # Global styles with Tailwind
└── main.tsx          # Application entry point
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and npm
- Backend server running (see server README)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:4000/api/v1
```

## 🎨 **UI Components**

### **Custom CSS Classes**
- `.btn-primary`: Primary action buttons
- `.btn-secondary`: Secondary action buttons
- `.btn-danger`: Destructive action buttons
- `.input-field`: Form input styling
- `.card`: Content container cards
- `.form-label`: Form field labels
- `.error-message`: Error text styling

### **Color Scheme**
- **Primary**: Blue shades (primary-600, primary-700)
- **Secondary**: Gray shades for neutral elements
- **Success**: Green for positive actions
- **Warning**: Yellow for caution
- **Error**: Red for errors and destructive actions

## 🔐 **Authentication Flow**

1. **Login**: Email/password authentication
2. **JWT Storage**: Tokens stored in localStorage
3. **Protected Routes**: Automatic redirect for unauthenticated users
4. **Token Expiry**: Automatic logout on 401 responses
5. **Role-based Access**: Different navigation based on user role

## 📱 **Responsive Design**

- **Mobile First**: Optimized for small screens
- **Breakpoints**: Tailwind CSS responsive utilities
- **Navigation**: Collapsible sidebar on mobile
- **Touch Friendly**: Appropriate button sizes and spacing

## 🧪 **Development Guidelines**

### **Code Standards**
- Use TypeScript for all components
- Follow React functional component pattern
- Implement proper error boundaries
- Use semantic HTML elements
- Maintain consistent naming conventions

### **Form Handling**
- Use react-hook-form for form state
- Implement Zod schema validation
- Provide clear error messages
- Handle loading states properly

### **API Integration**
- Use the centralized apiService
- Implement proper error handling
- Show loading states during requests
- Handle network errors gracefully

## 🚀 **Deployment**

### **Build Process**
```bash
npm run build
```

### **Production Considerations**
- Environment variables for API endpoints
- Optimized bundle size
- CDN for static assets
- HTTPS enforcement
- Performance monitoring

## 🔧 **Customization**

### **Theming**
- Modify `tailwind.config.js` for color schemes
- Update CSS variables in `index.css`
- Customize component styles

### **Adding New Modules**
1. Create page component in `pages/`
2. Add route in `App.tsx`
3. Update navigation in `Layout.tsx`
4. Add types in `types/index.ts`
5. Implement API methods in `services/api.ts`

## 📚 **Dependencies**

### **Core Dependencies**
- **React 18**: UI library
- **React Router**: Client-side routing
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework

### **Form & Validation**
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Validation resolvers
- **zod**: Schema validation

### **UI & Icons**
- **lucide-react**: Modern icon library
- **@tailwindcss/forms**: Form styling
- **@tailwindcss/typography**: Typography utilities

### **HTTP Client**
- **axios**: HTTP client for API calls

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Build Errors**: Check TypeScript compilation
2. **Styling Issues**: Verify Tailwind CSS configuration
3. **API Errors**: Check backend server status
4. **Routing Issues**: Verify React Router setup

### **Development Tips**
- Use React DevTools for debugging
- Check browser console for errors
- Verify API endpoints with backend
- Test responsive design on multiple devices

## 🤝 **Contributing**

1. Follow the established code structure
2. Use TypeScript for all new code
3. Implement proper error handling
4. Add appropriate loading states
5. Test on multiple screen sizes
6. Update documentation as needed

## 📄 **License**

This project is part of the CMIS (College Management Information System) and follows the same licensing terms.

---

**Frontend Development Team**  
CMIS Project - Modern React + TypeScript Implementation
