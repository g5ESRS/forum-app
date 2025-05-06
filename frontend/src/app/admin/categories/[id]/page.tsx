'use client';

import React from 'react';
import {Category} from "@utils/types/forum";
import AdminCategory from "@/pages/admin/AdminCategory";

interface UserIdPageProps {
    params: Promise<{id: string}>;
}


function Page({params}: UserIdPageProps) {

    const {id} = React.use(params);

    const [category, setCategory] = React.useState<Category | undefined>(undefined);

    React.useEffect(() => {
        const fetchCategoryDetails = async () =>{
            try {
                const res = await fetch(`/api/forum/categories/${id}/`, {
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

                setCategory(data)
            } catch (err){
                console.error("Failed to fetch category:", err);
            }
        }

        fetchCategoryDetails();
    }, [id]);

    if (!category) return <div> </div>

    return (
        <AdminCategory category={category}/>
    );
}

export default Page;