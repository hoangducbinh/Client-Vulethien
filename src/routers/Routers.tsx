'use client'

import React, { useEffect, useState } from 'react';
import AuthRouter from './AuthRouter';
import MainRouter from './MainRouter';
import useAuthStore from '@/store/store';

const Routers = () => {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Simulate a loading state or use any async logic to determine authentication
    const checkAuth = async () => {
      // Simulate a delay or fetch data if needed
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <MainRouter />:<AuthRouter /> ;
};

export default Routers;
