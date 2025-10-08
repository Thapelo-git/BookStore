import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token, user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        setIsValidToken(false);
        return;
      }

      try {
        // If we have a token but no user data, try to get the profile
        if (token && !user) {
          const response = await authService.getProfile();
          if (response.data.success && response.data.data) {
            useAuthStore.getState().user = response.data.data;
            setIsValidToken(true);
          } else {
            throw new Error('Invalid token');
          }
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, user, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isValidToken) {
    // Redirect to login page with return url
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;