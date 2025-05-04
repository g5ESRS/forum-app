import React from 'react';
import {Topic} from "@utils/types/forum";
import ForumTopicCard from "@/components/ForumTopicCard";
import Link from "next/link";
import Button from "@/components/Button";

interface ForumTopicListProps {
    topics: Topic[];
    categoryId?: string;
    categoryName?: string;
}

function ForumTopicList({topics, categoryId}: ForumTopicListProps) {
    if (!topics) {
        topics = [];
    }

    return (
        <div className="w-full p-4 rounded-xl shadow border border-border">
            <div className="flex items-center justify-between mb-4 w-full">
                <h2 className="text-2xl font-semibold text-foreground">
                    {categoryId ? `Topics in Category ${categoryId}` : 'All Topics'}
                </h2>


                <Link href={`/topics/create${categoryId ? `?categoryId=${categoryId}` : ''}`}>
                    <Button className="bg-primary text-white hover:bg-primary-hover">
                        Create Topic
                    </Button>
                </Link>
            </div>

            {topics.length === 0 ? (
                <div className="text-sm text-foreground-muted italic">
                    No topics have been posted yet.
                </div>
            ) : (
                <div className="space-y-4 flex flex-col break-all">
                    {topics.map((topic) => (
                        <div key={topic.id}>
                        <ForumTopicCard topic={topic}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ForumTopicList;