
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Navigation from './components/Navigation';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import BookForm from './components/BookForm';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Home from './pages/Home'; 
import BooksPage from './pages/BooksPage';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  const { isAuthenticated  } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        
        <main>
          <Routes>
            <Route 
              path="/" 
              element={!isAuthenticated ? <Index/> : <Navigate to="/home" replace />} 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Home />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/" 
              element={!isAuthenticated ? <Index/> : <Navigate to="/home" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <RegisterPage/> : <Navigate to="/home" replace />} 
            />
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage/> : <Navigate to="/home" replace />} 
            />
            <Route 
              path="/reset-password" 
              element={!isAuthenticated ? <ResetPassword/> : <Navigate to="/home" replace />} 
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
            
            
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;