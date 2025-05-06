import React from 'react';
import {BASE_URL} from "@utils/constants";
import ForumCategoryList from "@/components/ForumCategoryList";

async function CategoryListPage() {

    let categories;

    try {
        const responseCategories = await fetch(`${BASE_URL}/api/forum/categories`, {
            next: { revalidate: 10 },
        });

        categories = await responseCategories.json();

    } catch {
        return <div>Error loading categories</div>;
    }

    return (
        <ForumCategoryList categories={categories} />
    );
}

export default CategoryListPage;