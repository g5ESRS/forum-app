import React from 'react';
import {BASE_URL} from "@utils/constants";
import PostList from "@/components/Topic/PostList";
import TopicHeader from "@/components/Topic/TopicHeader";
import TopicContent from "@/components/Topic/TopicContent"
import TopicAddPost from "@/components/Topic/TopicAddPost";

interface ForumTopicPageProps {
    id: number;
}

async function ForumTopicPage({id}: ForumTopicPageProps) {
    const response = await fetch(`${BASE_URL}/api/forum/topics/${id}`);

    const topic = await response.json();

    if (!topic) {
        return (
            <div> Loading... </div>
        )
    }

    return (
        <div className="mx-auto w-2/3 px-4 py-6 space-y-8 font-sans">
            <div className="bg-white rounded-xl shadow border border-border p-6">
                <TopicHeader topic={topic}/>
                <TopicContent content={topic.content}/>
            </div>

            <PostList posts={topic.posts}/>

            <TopicAddPost topicId={topic.id}/>
        </div>
    );
}

export default ForumTopicPage;