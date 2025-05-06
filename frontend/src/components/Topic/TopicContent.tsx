import React from 'react';

interface TopicContentProps {
    content: string;
}

function TopicContent({content}: TopicContentProps) {
    return (
        <div className="text-foreground mt-4 whitespace-pre-wrap break-all">{content}</div>
    );
}

export default TopicContent;