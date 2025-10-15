// components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log('🔐 ProtectedRoute - Current state:', {
      zustandToken: token,
      zustandAuthenticated: isAuthenticated,
      localStorageToken: localStorage.getItem('token'),
      hasUser: !!user
    });

    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      // Case 1: No token anywhere - redirect immediately
      if (!token && !storedToken) {
        console.log('🚫 No token found anywhere, redirecting to login');
        setIsChecking(false);
        return;
      }

      // Case 2: Token in localStorage but not in Zustand - sync Zustand
      if (storedToken && !token) {
        console.log('🔄 Token found in localStorage but not in Zustand, syncing...');
        
        // If we have a token but no user data, try to get profile
        if (storedToken && !user) {
          try {
            console.log('🔄 Fetching user profile...');
            const response = await authService.getProfile();
            if (response.data.success && response.data.data) {
              useAuthStore.setState({
                user: response.data.data,
                token: storedToken,
                isAuthenticated: true
              });
              console.log('✅ User profile loaded and state synced');
            }
          } catch (error) {
            console.error('❌ Failed to get user profile:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            useAuthStore.getState().logout();
          }
        } else {
          // Just sync the token
          useAuthStore.setState({
            token: storedToken,
            isAuthenticated: true
          });
          console.log('✅ Token synced to Zustand');
        }
      }

      // Case 3: Zustand says authenticated but no localStorage token - clear state
      if (isAuthenticated && !storedToken) {
        console.log('🚫 Zustand says authenticated but no token in localStorage, clearing state');
        useAuthStore.getState().logout();
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, token, user]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // Check both Zustand state AND localStorage token
  const isReallyAuthenticated = isAuthenticated && localStorage.getItem('token');
  
  if (!isReallyAuthenticated) {
    console.log('🚫 Not properly authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;