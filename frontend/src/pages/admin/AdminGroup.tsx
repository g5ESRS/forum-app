/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useEffect, useState } from 'react';
import { Group, Permission } from "@utils/types/user";

interface AdminGroupProps {
    group: Group;
}

export default function AdminGroup({ group }: AdminGroupProps) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
        group.permissions
    );
    const [groupName, setGroupName] = useState<string>(group.name);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


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

    const togglePermission = (id: number) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/groups/${group.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: groupName, permissions: selectedPermissions }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to update group');
            }
            setIsEditing(false);
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 w-full">
            <div className="max-w-2xl mx-auto bg-background-muted p-6 rounded-2xl shadow border border-border">
                <h1 className="text-2xl font-semibold text-foreground mb-6">Group Details</h1>

                {!isEditing ? (
                    <>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-foreground-muted">Name</label>
                                <p className="text-lg text-foreground">{group.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-muted">Permissions</label>
                                <ul className="list-disc list-inside text-foreground">
                                    {group.permissions.length ? (
                                        group.permissions.map(permissionId => {
                                            const permission = permissions.find(p => p.id === permissionId);
                                            return (
                                                <li key={permission?.id} className="ml-4">
                                                    {permission?.name} ({permission?.codename})
                                                </li>
                                            )
                                        })
                                    ) : (
                                        "No permissions assigned"
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Edit Group
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSave} className="space-y-4">
                        {error && <p className="text-red-600">{error}</p>}

                        <div>
                            <label className="block text-sm text-foreground-muted mb-1">Name</label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
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
                                            className="h-4 w-4"
                                        />
                                        <span>{p.name} ({p.codename})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 space-x-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
