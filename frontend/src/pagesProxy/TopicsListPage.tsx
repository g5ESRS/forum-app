import React from 'react';
import {BASE_URL} from "@utils/constants";
import ForumTopicList from "@/components/ForumTopicList";

async function TopicsListPage() {

    let topics;

    try {
        const responseTopics = await fetch(`${BASE_URL}/api/forum/topics`, {
            next: {revalidate: 1},
        });

        topics = await responseTopics.json();
    } catch {
        return <div>Error loading topics</div>;
    }

    return (
        <div className="flex justify-center p-4">
            <ForumTopicList topics={topics}/>
        </div>
    );
}

export default TopicsListPage;