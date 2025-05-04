import React from 'react';
import {Category} from "@utils/types/forum";
import Link from "next/link";

interface ForumCategoryCardProps {
    category: Category;
    linkFactory: (category: Category) => string;
}

function ForumCategoryCard({
    category,
    linkFactory,
}: ForumCategoryCardProps) {
    return (
        <Link
            href={linkFactory(category)}
            className="block p-3 rounded-xl hover:bg-primary-hover transition text-foreground bg-white border border-border shadow-sm"
        >
            <div className="font-semibold text-lg">{category.name}</div>
            <p className="text-sm text-foreground-muted">{category.description}</p>
        </Link>
    );
}

export default ForumCategoryCard;