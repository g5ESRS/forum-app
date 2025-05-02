import React from 'react';
import {Topic} from "@utils/types/forum";

interface TopicHeaderProps {
    topic: Topic;
}

function TopicHeader({topic} : TopicHeaderProps) {
    const {title, category, views, pinned, closed} = topic;

    return (
        <div className="mb-2 flex flex-wrap justify-between items-start gap-2">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-foreground-muted">
                    in <span className="font-medium">{category.name}</span> · {views} views
                </p>
            </div>
            <div className="flex gap-2">
                {pinned && (
                    <span className="text-sm text-primary font-semibold bg-primary/10 px-2 py-1 rounded">
                        📌 Pinned
                    </span>
                )}
                {closed && (
                    <span className="text-sm text-danger font-semibold bg-danger/10 px-2 py-1 rounded">
                        🔒 Closed
                    </span>
                )}
            </div>
        </div>

    );
}

export default TopicHeader;