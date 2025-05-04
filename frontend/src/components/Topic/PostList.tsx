import React from 'react';
import {Post} from "@utils/types/forum";
import PostItem from "@/components/Topic/PostItem";

interface PostListProps {
    posts: Post[];
}

function PostList({posts}: PostListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Replies</h2>
            {posts.length === 0 ? (
                <div className="p-4 border border-dashed border-border rounded-xl text-sm text-foreground-muted">
                    No replies yet. Be the first to comment!
                </div>
            ) : (
                posts.map((post) => {
                    return (
                        <div key={post.id}>
                            <PostItem post={post}/>
                        </div>
                    )
                })
            )}
        </div>
    );
}

export default PostList;