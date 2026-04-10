import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = (() => {
    try { 
        return JSON.parse(localStorage.getItem('agrisense_user'));
    } catch { 
        return null;
    }
  })();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
