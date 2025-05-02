'use client'

import React from 'react';
import {useRouter} from "next/navigation";
import Input from "@/components/Input";
import {useAuth} from "@/context/AuthContext";

interface TopicAddPostProps {
    topicId: number;
}


function TopicAddPost(
    { topicId }: TopicAddPostProps
) {
    const [newPostContent, setNewPostContent] = React.useState<string>('');
    const router = useRouter();
    const {user, loading} = useAuth();

    const handleAddPost = async () => {
        if (!newPostContent.trim()) return;
        setNewPostContent('');
        await fetch(`/api/forum/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: topicId,
                content: newPostContent
            }),
        })


        router.refresh();
    };

    if (loading) {
        return <div></div>;
    }

    if (!user) {
        return (
            <div className="bg-white rounded-xl shadow border border-border p-4 flex items-center justify-between">
                <div>
                    <h3 className="text-md font-semibold text-foreground mb-1">Want to join the conversation?</h3>
                    <p className="text-sm text-muted-foreground">Log in to add your reply and engage with others.</p>
                </div>
                <a
                    href="/auth/login"
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover"
                >
                    Log In
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow border border-border p-4">
            <h3 className="text-md font-semibold text-foreground mb-2">Add a Reply</h3>
            <Input
                type="text"
                placeholder="Write your reply..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="mb-2"
            />
            <div className={"flex justify-end w-full"}>
                <button
                    onClick={handleAddPost}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
                >
                    Post Reply
                </button>
            </div>
        </div>
    );
}

export default TopicAddPost;