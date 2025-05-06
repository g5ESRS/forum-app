'use client';

import React from 'react';
import {Group} from "@utils/types/user";
import AdminGroup from "@/pagesProxy/admin/AdminGroup";

interface IdPageProps {
    params: Promise<{ id: string }>;
}

function getGroupFromId(id: string, groups: Group[]): Group {
    return groups.find(group => group.id === Number(id)) as Group;
}

function Page({params}: IdPageProps) {
    const {id} = React.use(params);

    const [group, setGroup] = React.useState<Group | undefined>(undefined);

    React.useEffect(() => {
        const fetchGroupDetails = async () =>{
            try {
                const res = await fetch(`/api/admin/groups`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    cache: 'no-store',
                });

                let data = await res.json();

                data = typeof data === "string" ? JSON.parse(data) : data

                const group = getGroupFromId(id, data)

                setGroup(group)
            } catch (err){
                console.error("Failed to fetch group:", err);
            }
        }

        fetchGroupDetails();
    }, [id]);

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <AdminGroup group={group}/>
    );
}

export default Page;