import React from 'react';
import CategoryTopicsPage from "@/pages/CategoryTopicsPage";
import {BASE_URL} from "@utils/constants";

interface CategeryTopicsPageProps {
    params: Promise<{id: string}>;
}

async function Page({params}: CategeryTopicsPageProps) {

    const { id } = await params;

    const response = await fetch(`${BASE_URL}/api/forum/categories/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const category = await response.json();

    return (
        <CategoryTopicsPage topics={category.topics} categoryId={id}/>
    );
}

export default Page;