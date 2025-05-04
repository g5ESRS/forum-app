import {BACKEND_URL} from "@utils/constants";


export async function GET(){

    const res = await fetch(`${BACKEND_URL}/api/forum/topics/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        console.error("Backend error:", await res.text());
        return new Response("Server error", { status: 502 });
    }

    let topics;
    try {
        topics = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(topics.results), { status: 200 });
}