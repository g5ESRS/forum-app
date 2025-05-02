import React from 'react';
import {Topic} from "@utils/types/forum";
import ForumTopicCard from "@/components/ForumTopicCard";

interface ForumTopicListProps {
    topics: Topic[];
}

function ForumTopicList({topics}: ForumTopicListProps) {
    if (topics.length === 0) {
        return (
            <div className="text-center text-foreground-muted py-10">
                No topics found.
            </div>
        );
    }

    return (
        <div className="w-full p-4 rounded-xl shadow border border-border ">
            <h2 className="text-xl font-bold text-foreground mb-4">Topics</h2>

            <div className="space-y-4 flex flex-col">
                {topics.map((topic) => (
                    <div key={topic.id}>
                        <ForumTopicCard topic={topic}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ForumTopicList;