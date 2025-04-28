import React from 'react';
import {UserDetails} from "@utils/types/user";

interface AdminUserProps {
    user: UserDetails;
}

function AdminUser({
    user,
}: AdminUserProps) {



    return (
        <div className="min-h-screen bg-background p-6">
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
                            {user.groups.length !== 0 ? user.groups.map((group) => (
                                <li key={group.id} className="ml-4">
                                    {group.name}
                                </li>
                            )) : "No groups assigned"}
                        </ul>
                    </div>

                    {/* User Permissions */}
                    <div>
                        <label className="block text-sm text-foreground-muted">User Permissions (Direct)</label>
                        <ul className="list-disc list-inside text-foreground">
                            {user.user_permissions.length !== 0 ? user.user_permissions.map((permission) => (
                                <li key={permission.id} className="ml-4">
                                    {permission.name} ({permission.codename})
                                </li>
                            )) : "No user permissions assigned"}
                        </ul>
                    </div>

                    {/* Permissions */}
                    <div>
                        <label className="block text-sm text-foreground-muted">Permissions</label>
                        <ul className="list-disc list-inside text-foreground">
                            {user.permissions.length !== 0 ? user.permissions.map((permission) => (
                                <li key={permission.id} className="ml-4">
                                    {permission.name} ({permission.codename})
                                </li>
                            )) : "No permissions assigned"}
                        </ul>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default AdminUser;