import {BACKEND_URL} from "@utils/constants";


export async function POST(req: Request) {
    let body: unknown;

    try {
        body = await req.json();
    } catch {
        return new Response("Invalid JSON", {status: 400});
    }
    const res = await fetch(`${BACKEND_URL}/api/auth/password/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (res.status === 401) return new Response('Unauthorized', { status: 401 });

    if (!res.ok) {
        console.error("Backend error:", await res.text());
        return new Response("Server error", { status: 502 });
    }

    try {
        await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response("Email is sent", { status: 200 });
}