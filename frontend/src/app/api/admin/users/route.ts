import {BACKEND_URL} from "@utils/constants";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";

export async function GET(req: Request) {
    const res = await fetchWithAuth(`${BACKEND_URL}/api/auth/users/`)

    let body: unknown;

    try {
        body = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    let users = body['results']

    return new Response(JSON.stringify(users), {status: 200})
}