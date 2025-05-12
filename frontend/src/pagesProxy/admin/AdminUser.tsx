/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import React, { useEffect, useState } from 'react';
import { Group, Permission, UserDetails } from "@utils/types/user";

interface AdminUserProps {
    user: UserDetails;
}

function findPermissionById(permissions: Permission[], id: number): Permission | undefined {
    return permissions.find(permission => permission.id === id);
}

const AdminUser: React.FC<AdminUserProps> = ({ user }) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([...user.user_permissions]);
    const [selectedGroups, setSelectedGroups] = useState<number[]>(user.groups.map(g => g.id));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        async function fetchAllPermissions() {
            try {
                const res = await fetch('/api/admin/permissions/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Error fetching permissions');
                const data: Permission[] = await res.json();
                setPermissions(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchAllPermissions();
    }, []);

    useEffect(() => {
        async function fetchAllGroups() {
            try {
                const res = await fetch('/api/admin/groups/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Error fetching groups');
                const data: Group[] = await res.json();
                setGroups(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchAllGroups();
    }, []);

    const togglePermission = (id: number) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const toggleGroup = (id: number) => {
        setSelectedGroups(prev =>
            prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/users/${user.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    user_permissions: selectedPermissions,
                    groups: selectedGroups,
                }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to update user');
            }
            setShowForm(false);
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
                <h1 className="text-2xl font-semibold text-foreground mb-6">User Profile</h1>
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm text-foreground-muted">Username</label>
                        <p className="text-lg text-foreground">{user.username}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-foreground-muted">Email</label>
                        <p className="text-lg text-foreground">{user.email}</p>
                    </div>

                    {/* Groups */}
                    <div>
                        <label className="block text-sm text-foreground-muted">Groups</label>
                        <ul className="list-disc list-inside text-foreground">
                            {user.groups.length ? (
                                user.groups.map(group => (
                                    <li key={group.id} className="ml-4">
                                        {group.name}
                                    </li>
                                ))
                            ) : (
                                "No groups assigned"
                            )}
                        </ul>
                    </div>

                    {/* User Permissions */}
                    <div>
                        <label className="block text-sm text-foreground-muted">User Permissions (Direct)</label>
                        <ul className="list-disc list-inside text-foreground">
                            {user.user_permissions.length ? (
                                user.user_permissions.map(permissionId => {
                                    const perm = findPermissionById(permissions, permissionId);
                                    return (
                                        <li key={permissionId} className="ml-4">
                                            {perm ? `${perm.name} (${perm.codename})` : `Permission ID: ${permissionId} not found`}
                                        </li>
                                    );
                                })
                            ) : (
                                "No user permissions assigned"
                            )}
                        </ul>
                    </div>

                    {/* Effective Permissions */}
                    <div>
                        <label className="block text-sm text-foreground-muted">Permissions</label>
                        <ul className="list-disc list-inside text-foreground">
                            {user.permissions?.length ? (
                                user.permissions?.map(permission => (
                                    <li key={permission.id} className="ml-4">
                                        {permission.name} ({permission.codename})
                                    </li>
                                ))
                            ) : (
                                "No permissions assigned"
                            )}
                        </ul>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-primary-active text-white rounded"
                        >
                            Edit Assignments
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="mt-6 bg-white p-4 rounded shadow">
                            {error && <p className="text-red-600 mb-2">{error}</p>}

                            {/* Permissions Checkboxes */}
                            <div>
                                <label className="block text-sm text-foreground-muted mb-1">Permissions</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-auto">
                                    {permissions?.map(p => (
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

                            {/* Groups Checkboxes */}
                            <div className="mt-4">
                                <label className="block text-sm text-foreground-muted mb-1">Groups</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-auto">
                                    {groups.map(g => (
                                        <label key={g.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedGroups.includes(g.id)}
                                                onChange={() => toggleGroup(g.id)}
                                                className="h-4 w-4 text-blue-600"
                                            />
                                            <span>{g.name}</span>
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
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


export const dynamic = 'force-dynamic';

export default AdminUser;
