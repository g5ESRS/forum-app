import React from 'react';
import {Post} from "@utils/types/forum";

interface PostItemProps {
    post: Post;
}

async function PostItem({post}: PostItemProps) {

    return (
        <div className="p-4 bg-background-muted rounded-xl border border-border text-foreground break-all">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                    {post.author}
                </span>
                <span className="text-xs text-foreground-muted">
                    {new Date(post.created_at).toLocaleString()}
                </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        </div>
    );
}

export default PostItem;