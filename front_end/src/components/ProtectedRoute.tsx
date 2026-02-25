import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        logout();
        setIsChecking(false);
        return;
      }

      // Sync Zustand state if missing user
      if (storedToken && !user) {
        try {
          const response = await authService.getProfile();

          if (response.data.success) {
            useAuthStore.setState({
              user: response.data.data,
              token: storedToken,
              isAuthenticated: true
            });
          }
        } catch (error) {
          console.error(error);
          logout();
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ⭐ Role authorization check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
