
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
//import Navigation from './components/Navigation';

import BookForm from './components/BookForm';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
//import Home from './pages/Home'; 
import BooksPage from './pages/BooksPage';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AuthPage from './pages/AuthPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CardPage';
import ClientAccount from './pages/ClientAccount';
import MerchantDashboard from './pages/MerchantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// RoleRedirect component to send authenticated users to their dashboard based on role
function RoleRedirect() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    if (user.role === 'client') navigate('/client', { replace: true });
    else if (user.role === 'merchant') navigate('/merchant', { replace: true });
    else if (user.role === 'admin') navigate('/admin', { replace: true });
    else navigate('/home', { replace: true });
  }, [user, navigate]);
  return null;
}
function App() {
  const { isAuthenticated } = useAuthStore();
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* <Navigation /> */}
        
        <main>
          <Routes>
            <Route 
              path="/" 
              element={!isAuthenticated ? <Index/> : <Navigate to="/home" replace />} 
            />
            {/* <Route 
              path="/register" 
              element={!isAuthenticated ? <RegisterPage/> : <Navigate to="/home" replace />} 
            /> */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <AuthPage/> : <RoleRedirect />} 
            />
  
            <Route 
              path="/reset-password" 
              element={!isAuthenticated ? <ResetPassword/> : <Navigate to="/books" replace />} 
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <BooksPage/>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/new"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <BookForm />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={
              <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                   <CartPage />
                  </div>
                </ProtectedRoute>
              } />
            <Route path="/book/:id" element={
              <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                   <BookDetailPage/>
                  </div>
                </ProtectedRoute>
              } />
            <Route
              path="/books/edit/:id"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <BookForm />
                  </div>
                </ProtectedRoute>
              }
            />
                       <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword/> : <Navigate to="/home" replace />} />
            <Route
  path="/client"
  element={
    <ProtectedRoute allowedRoles={['client']}>
      <ClientAccount />
    </ProtectedRoute>
  }
/>

           <Route
  path="/merchant"
  element={
    <ProtectedRoute allowedRoles={['merchant']}>
      <MerchantDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard/>
    </ProtectedRoute>
  }
/>

            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;