import {fetchWithAuth} from "@utils/auth/fetchWithAuth";

export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;

    const res = await fetchWithAuth(`/api/auth/users/${id}/`)

    let body: unknown;

    try {
        body = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(body), {status: 200})
}

export async function PATCH(req: Request, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;

    const newJSON = await req.text()
    const res = await fetchWithAuth(`/api/auth/users/${id}/`, {
        method: 'PATCH',
        body: newJSON,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    let body: unknown;

    try {
        body = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(body), {status: 200})
}