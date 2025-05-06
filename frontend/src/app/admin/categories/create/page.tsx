'use client';

import React, {useState} from 'react';
import {useRouter} from "next/navigation";

function Page() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/forum/categories/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    slug,
                    description,
                    is_active: isActive,
                }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to create category');
            }
            // redirect to categories list or newly created category page
            router.push('/admin/categories');
        } catch  {
            setError('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 w-full">
            <div className="max-w-2xl mx-auto bg-background-muted p-6 rounded-2xl shadow border border-border">
                <h1 className="text-2xl font-semibold text-foreground mb-6">Create New Category</h1>
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
                        <label htmlFor="slug" className="block text-sm text-foreground-muted mb-1">
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm text-foreground-muted mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            rows={4}
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="isActive"
                            type="checkbox"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm text-foreground">
                            Active
                        </label>
                    </div>

                    <div className="mt-4 space-x-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Page;