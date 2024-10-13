'use client'
import Header from '@/app/components/Header';
import Layout from '@/app/(main)/layout';
import useAuthStore from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Dashboard from '../dashboard/page';

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
           <Dashboard />
           
        </>
       
        
    );
}

export default HomePage;
