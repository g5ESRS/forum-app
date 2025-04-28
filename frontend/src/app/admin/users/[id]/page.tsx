'use client'

import React, {useEffect, useState} from 'react';
import {UserDetails} from "@utils/types/user";
import AdminUser from "@/pages/admin/AdminUser";

interface UserIdPageProps {
    params: {
        id: string;
    };
}

function UserIdPage({params}: UserIdPageProps) {

    const {id} = React.use(params);

    const [user, setUser] = useState<UserDetails | undefined>(undefined);

    useEffect(() => {
        const fetchUserDetails = async () =>{
            try {
                console.log("Starting")

                const res = await fetch(`/api/auth/user/${id}`);

                let data = await res.json();

                data = typeof data === "string" ? JSON.parse(data) : data

                console.log(data)

                setUser(data)
            } catch (err){
                console.error("Failed to fetch user:", err);
            }
        }

        fetchUserDetails();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <AdminUser user={user}/>
        </div>
    );
}

export default UserIdPage;