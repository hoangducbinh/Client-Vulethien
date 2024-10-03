'use client'

import CustomerHome from '@/app/(customer)/customer/page';
import useAuthStore from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const MainRouter = () => {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    // Redirect to home page if already authenticated
    if (isAuthenticated) {
        router.push('/customer');
    }
}, [isAuthenticated, router]);

// Render login page only if not authenticated
if (isAuthenticated) {
    return null; // Or a loading indicator
}
  return (
    <>
    <CustomerHome/>
    </>
  )
}

export default MainRouter