import {BACKEND_URL} from "@utils/constants";
import {handleErrorResponse} from "@utils/handleErrorResponse";

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
        return handleErrorResponse(res, await res.json());
    }

    let topic;
    try {
        topic = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(topic), { status: 200 });
}