import {BACKEND_URL} from "@utils/constants";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";


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


export async function POST(req: Request) {
    const body = await req.json();

    const res = await fetchWithAuth(`/api/forum/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        return new Response("Server error", { status: 502 });
    }

    let category;
    try {
        category = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(category), { status: 200 });
}