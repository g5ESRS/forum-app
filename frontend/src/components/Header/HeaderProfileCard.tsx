'use client';

import React from 'react';
import {useAuth} from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import {LoginLinkFactory} from "@utils/linkFactories/forum";
import {useRouter} from "next/navigation";

function HeaderProfileCard() {
    const {user, loading} = useAuth();
    const router = useRouter();

    if (loading) {
        return(
            <div>  </div>
        );
    }

    if (!user) return <div><Link className={"text-primary hover:text-primary-hover"} href={`${LoginLinkFactory()}`}> Login </Link></div>;

    return (
        <div
            className="relative flex flex-row items-center space-x-4 cursor-pointer"
            onClick={() => {router.push("/profile")} }
        >
            <Image
                src="/avatar.webp"
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full"
            />
            <span
                className="block font-medium text-secondary-active hover:text-secondary-hover">{user.username}</span>
        </div>
    );
}

export default HeaderProfileCard;