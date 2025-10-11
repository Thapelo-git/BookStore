
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Navigation from './components/Navigation';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import BookForm from './components/BookForm';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home'; // Make sure you have this
import BooksPage from './pages/BooksPage';

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
              element={
                isAuthenticated ? (
                  <Home />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />} 
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;