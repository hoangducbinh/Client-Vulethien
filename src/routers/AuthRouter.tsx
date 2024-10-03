'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/store';
import SigninPage from '@/app/(auth)/(customer)/signin/page';


const AuthRouter = () => {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page if already authenticated
        if (isAuthenticated) {
            router.push('/allproducts');
        }
    }, [isAuthenticated, router]);

    // Render login page only if not authenticated
    if (isAuthenticated) {
        return null; // Or a loading indicator
    }

    return <SigninPage />;
};

export default AuthRouter;
