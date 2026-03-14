import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { User } from './types';
import apiService from './services/api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Departments from './pages/Departments';
import Fees from './pages/Fees';
import Exams from './pages/Exams';
import Attendance from './pages/Attendance';
import Timetable from './pages/Timetable';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = apiService.getAuthToken();
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        apiService.removeAuthToken();
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    apiService.setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    apiService.removeAuthToken();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CMIS...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/dashboard" replace /> : 
              <Register onRegister={handleLogin} />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Navigate to="/dashboard" replace />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Dashboard />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/students" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Students />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Courses />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/departments" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Departments />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/fees" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Fees />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/exams" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Exams />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Attendance />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/timetable" 
            element={
              <ProtectedRoute user={user}>
                {user && <Layout user={user} onLogout={handleLogout}>
                  <Timetable />
                </Layout>}
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              user ? <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
