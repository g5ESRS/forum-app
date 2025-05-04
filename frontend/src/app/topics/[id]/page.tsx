import React from 'react';
import ForumTopicPage from "@/components/Topic/ForumTopicPage";

interface PageProps {
    params: Promise<{ id: string }>;
}

async function Page({params}: PageProps) {
    const {id} = await params;

    return (
        <ForumTopicPage id={parseInt(id)}/>
    );
}

export default Page;