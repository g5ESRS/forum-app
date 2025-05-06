import {BACKEND_URL} from "@utils/constants";


export async function GET(){
    const res = await fetch(`${BACKEND_URL}/api/forum/categories/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        return new Response("Server error", { status: 502 });
    }

    let categories;
    try {
        categories = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(categories.results), { status: 200 });
}