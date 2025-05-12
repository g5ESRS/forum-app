'use client';

import React from 'react';
import Link from "next/link";
import HeaderProfileCard from "@/components/Header/HeaderProfileCard";

function Header() {
    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 shadow-md bg-foreground-muted">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-semibold text-primary-active hover:text-primary-hover">ForumApp</span>
                </Link>


                <HeaderProfileCard/>
            </header>
            <div className="h-16 w-full"/>
        </>
    );
}

export default Header;