"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type BackButtonProps = {
    label: string;
    href: string 
}

export const BackButton: React.FC<BackButtonProps> = ({ label, href }) => {
    return (
        <Button
            variant={'link'}
            className='font-normal w-full'
            size={'sm'}
            asChild>
            <Link href={href} className='text-sm'>{label}</Link>
        </Button>
    );
}