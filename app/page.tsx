"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { getLogin } from '@/repository/auth';

const Page: React.FC = () => {
    const router = useRouter();
    if(!getLogin()) {
        router.push('/login');
    } else {
        router.push('/discover');
    }
    return null;
};

export default Page;