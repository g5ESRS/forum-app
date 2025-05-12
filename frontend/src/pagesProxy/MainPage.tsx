import React from 'react';
import ForumCategoryList from "@/components/ForumCategoryList";
import ForumTopicList from "@/components/ForumTopicList";
import {BASE_URL} from "@utils/constants";


async function MainPage() {
    let category, topics;


    try {
        const responseCategory = await fetch(`${BASE_URL}/api/forum/categories/`, {
            next: { revalidate: 1 },
        });

        const responseTopics = await fetch(`${BASE_URL}/api/forum/topics/`, {
            next: { revalidate: 1 },
        });

        if (!responseCategory.ok || !responseTopics.ok) {
            console.error("Error fetching data:", responseCategory.status, responseTopics.status);
        }

        category = await responseCategory.json();
        topics = await responseTopics.json();


        console.log("category", category);
        console.log("topics", topics);

        if (!(category && topics)) {
            return (
                <div> </div>
            )
        }
    }catch (e) {
        console.error("Error fetching data:", e);
        category = [];
        topics = [];
    }

    return (
        <div className="flex justify-center p-4">
            <div className="grid grid-cols-[1fr_2fr] gap-4 w-full max-w-6xl">
                <ForumCategoryList categories={category}/>
                <ForumTopicList topics={topics}/>
            </div>
        </div>

    );
}

export default MainPage;