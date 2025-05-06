'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {Permission} from "@utils/types/user";

function Page() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    useEffect(() => {
        async function loadPermissions() {
            try {
                const res = await fetch('/api/admin/permissions/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    cache: 'no-store',
                });
                if (!res.ok) throw new Error('Failed to load permissions');
                const data: Permission[] = await res.json();
                setPermissions(data);
            } catch (err) {
                console.error(err);
            }
        }
        loadPermissions();
    }, []);

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/groups/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: name,
                    permissions: selectedPermissions,
                }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to create group');
            }
            // redirect to groups list or newly created group page
            router.push('/admin/groups');
        } catch  {
            setError('Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (id: number) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    return (
        <div className={"min-h-screen bg-background p-6 w-full"}>
            <div className={"max-w-2xl mx-auto bg-background-muted p-6 rounded-2xl shadow border border-border"}>
                <h1 className="text-2xl font-semibold text-foreground mb-6">Create New Group</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-600">{error}</p>}

                    <div>
                        <label htmlFor="name" className="block text-sm text-foreground-muted mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-foreground-muted mb-1">Permissions</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-auto">
                            {permissions.map(p => (
                                <label key={p.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(p.id)}
                                        onChange={() => togglePermission(p.id)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <span>{p.name} ({p.codename})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 px-4 py-2 bg-primary-active text-white rounded`}
                    >
                        {loading ? 'Creating...' : 'Create Group'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Page;