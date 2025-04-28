"use client";

import React, {useEffect, useState} from 'react';
import {BaseUser} from "@utils/types/user";
import Button from "@/components/Button";
import {useRouter} from "next/navigation";

function ProfilePage() {
    const [user, setUser] = useState<BaseUser | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/user");

                if (!res.ok) {
                    throw new Error(`HTTP error ${res.status}`);
                }

                let data = await res.json();

                data = typeof data === "string" ? JSON.parse(data) : data

                if (!data || typeof data.username !== "string" || typeof data.email !== "string") {
                    throw new Error("Invalid user data");
                }

                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, []);

    if (!user) return <div>Loading...</div>;

    const {username, email} = user;

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }

            router.push("/auth/login");
        } catch (err) {
            console.error("Failed to logout:", err);
        }
    }

    return (
        <div className="min-h-screen bg-background p-6">
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
                    <Button type={"button"} variant="secondary" className="mt-4" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;