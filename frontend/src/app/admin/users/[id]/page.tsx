'use client'

import React, {useEffect, useState} from 'react';
import {UserDetails} from "@utils/types/user";
import AdminUser from "@/pagesProxy/admin/AdminUser";

export const dynamic = 'force-dynamic';

interface UserIdPageProps {
    params: Promise<{id: string}>;
}

function UserIdPage({params}: UserIdPageProps) {

    const {id} = React.use(params);

    const [user, setUser] = useState<UserDetails | undefined>(undefined);

    useEffect(() => {
        const fetchUserDetails = async () =>{
            try {
                const res = await fetch(`/api/auth/user/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    cache: 'no-store',
                });

                let data = await res.json();

                data = typeof data === "string" ? JSON.parse(data) : data

                console.log(data)

                setUser(data)
            } catch (err){
                console.error("Failed to fetch user:", err);
            }
        }

        fetchUserDetails();
    }, [id]);

    if (!user) return <div>Loading...</div>;

    return (
            <AdminUser user={user}/>
    );
}

export default UserIdPage;