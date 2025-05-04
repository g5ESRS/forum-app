'use client';

import React, { useEffect } from 'react';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { LoginLinkFactory } from '@utils/linkFactories/forum';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();

    const { user, loading, logout } = useAuth();

    // Redirect once we know there's no user
    useEffect(() => {
        if (loading) return; // Don't redirect while loading

        if (!user) {
            console.error('User not found, redirecting to login');
            router.push(LoginLinkFactory());
        }
    }, [user, router, loading]);

    // While auth status is loading *or* we've kicked off the redirect, don't render the profile UI
    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
    }

    // At this point we know `user` is defined
    const { username, email } = user;

    const handleLogout = async () => {
        try {
            await logout();
            router.push(LoginLinkFactory());
        } catch (err) {
            console.error('Failed to logout:', err);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 w-full">
            <div className="max-w-xl mx-auto bg-background-muted p-6 rounded-xl shadow border border-border">
                <h1 className="text-2xl font-semibold text-foreground mb-4">Profile</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-foreground-muted">Username</label>
                        <p className="text-lg text-foreground">{username}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-foreground-muted">Email</label>
                        <p className="text-lg text-foreground">{email}</p>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        className="mt-4"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}