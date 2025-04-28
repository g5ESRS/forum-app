import {fetchWithAuth} from "@utils/auth/fetchWithAuth";
import {BACKEND_URL} from "@utils/constants";

export async function GET(req: Request, {params}: {params: {id: string}}) {
    const id = params.id;

    const res = await fetchWithAuth(`${BACKEND_URL}/api/auth/users/${id}`)

    let body: unknown;

    try {
        body = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(body), {status: 200})
}