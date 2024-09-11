'use client'

import useAuthStore from '@/zustand/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const HomePage = () => {
    const { isAuthenticated} = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login'); // Redirect to login page if not authenticated
        }
    }, [isAuthenticated, router]);

   
    return (
        <>
        <div className="flex flex-col items-center justify-center h-screen  bg-gradient-to-r from-blue-50 to-blue-100 ">
            <h1>Đây là trang chủ nè</h1>

        </div>
        </>
       
        
    );
}

export default HomePage;
