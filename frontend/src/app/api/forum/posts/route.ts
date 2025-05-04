import {BACKEND_URL} from "@utils/constants";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";

export async function POST(req: Request) {
    let body: unknown;

    try {
        body = await req.json();
    } catch {
        return new Response("Invalid JSON", {status: 400});
    }
    const res = await fetchWithAuth(`${BACKEND_URL}/api/forum/posts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        console.error("Backend error:", await res.text());
        return new Response("Server error", { status: 502 });
    }

    let result;

    try {
        result = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return Response.json(JSON.stringify(result), { status: 200 });
}