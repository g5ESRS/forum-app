import {BACKEND_URL} from "@utils/constants";

export async function GET(
    request: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const res = await fetch(`${BACKEND_URL}/api/forum/topics/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        console.error("Backend error:", await res.text());
        return new Response("Server error", { status: 502 });
    }

    let topic;
    try {
        topic = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(topic), { status: 200 });
}