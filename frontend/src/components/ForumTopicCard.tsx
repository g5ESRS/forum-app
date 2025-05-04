import React from 'react';
import {Topic} from "@utils/types/forum";
import Link from "next/link";
import {CategoryLinkFactory, TopicLinkFactory} from "@utils/linkFactories/forum";

interface ForumTopicCardProps {
    topic: Topic;
}

function ForumTopicCard({topic}: ForumTopicCardProps) {
    const {category} = topic;

    return (
        <div className="w-full p-4 bg-white rounded-xl shadow border border-border hover:shadow-md transition font-sans">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <Link href={`${TopicLinkFactory(topic)}`} className="text-lg font-bold text-foreground hover:text-primary line-clamp-1">
                        {topic.title}
                    </Link>
                    <p className="text-sm text-foreground-muted line-clamp-2 mt-1">
                        {topic.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-foreground-muted mt-2">
                        <span>in</span>
                        <Link href={`${CategoryLinkFactory(category)}`} className="hover:text-primary">
                            {topic.category.name}
                        </Link>
                    </div>
                </div>
                {topic.pinned && (
                    <span className="text-warning text-xs font-semibold">Pinned</span>
                )}
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-foreground-muted">
                <span>{topic.views} views</span>
                <span>{new Date(topic.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    );
}

export default ForumTopicCard;