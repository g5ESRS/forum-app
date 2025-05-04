import React from 'react';
import {Topic} from "@utils/types/forum";
import ForumTopicList from "@/components/ForumTopicList";

interface CategeryTopicsPageProps {
    topics: Topic[],
    categoryId?: string;
}

function CategoryTopicsPage({
    topics,
    categoryId
}: CategeryTopicsPageProps) {
    return (
        <div className={'flex justify-center p-4'}>
            <ForumTopicList topics={topics} categoryId={categoryId}/>
        </div>
    );
}

export default CategoryTopicsPage;