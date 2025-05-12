/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState } from 'react';
import { Category } from "@utils/types/forum";
import { useRouter } from 'next/navigation';

interface AdminCategoryProps {
    category: Category;
}

const AdminCategory: React.FC<AdminCategoryProps> = ({ category }) => {
    const [name, setName] = useState<string>(category.name);
    const [slug, setSlug] = useState<string>(category.slug);
    const [description, setDescription] = useState<string>(category.description || '');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/forum/categories/${category.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, slug, description }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to update category');
            }
            setShowForm(false);
            window.location.reload();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        await fetch(`/api/forum/categories/${category.id}/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })

        router.push('/admin/categories');
    }

    return (
        <div className="min-h-screen bg-background p-6 w-full">
            <div className="max-w-2xl mx-auto bg-background-muted p-6 rounded-2xl shadow border border-border">
                <h1 className="text-2xl font-semibold text-foreground mb-6">Category Details</h1>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-foreground">{category.name}</h2>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Delete Category
                    </button>
                </div>

                {!showForm ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-foreground-muted">Name</label>
                            <p className="text-lg text-foreground">{category.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-foreground-muted">Slug</label>
                            <p className="text-lg text-foreground">{category.slug}</p>
                        </div>
                        <div>
                            <label className="block text-sm text-foreground-muted">Description</label>
                            <p className="text-lg text-foreground">{category.description}</p>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-4 py-2 bg-primary-active text-white rounded"
                            >
                                Edit Category
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-600">{error}</p>}

                        <div>
                            <label className="block text-sm text-foreground-muted mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-foreground-muted mb-1">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-foreground-muted mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                                rows={4}
                            />
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
    );
};

export default AdminCategory;
