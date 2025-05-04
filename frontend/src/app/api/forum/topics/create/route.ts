import {BACKEND_URL} from "@utils/constants";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";

export async function POST(request: Request) {

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return new Response("Invalid JSON", {status: 400});
    }


    const res = await fetchWithAuth(`${BACKEND_URL}/api/forum/topics/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (res.status === 401) return new Response('Unauthorized', { status: 401 });

    if (!res.ok) {
        console.error("Backend error:", await res.text());
        return new Response("Server error", { status: 502 });
    }

    const result = await res.json();
    return Response.json(result, { status: 201 });
}