'use client'
import Header from '@/app/components/Header';
import Layout from '@/app/(main)/layout';
import useAuthStore from '@/zustand/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const { isAuthenticated} = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

   
    return (
        <>
                <Header />
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-3xl">Welcome to the home page</h1>
                </div>
           
        </>
       
        
    );
}

export default HomePage;
