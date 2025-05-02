import React from 'react';
import {Category} from "@utils/types/forum";
import Link from "next/link";
import {CategoryLinkFactory} from "@utils/linkFactories/forum";

interface ForumCategoryListProps {
    categories: Category[];
}

function ForumCategoryList({categories}: ForumCategoryListProps) {
    return (
        <div className="w-full max-w-sm p-4 bg-background-muted rounded-xl shadow border border-border font-sans">
            <h2 className="text-xl font-bold text-foreground mb-4">Categories</h2>
            <ul className="space-y-3">
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link
                            href={`${CategoryLinkFactory(category)}`}
                            className="block p-3 rounded-xl hover:bg-background text-foreground"
                        >
                            <div className="font-semibold text-lg">{category.name}</div>
                            <p className="text-sm text-foreground-muted">{category.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ForumCategoryList;