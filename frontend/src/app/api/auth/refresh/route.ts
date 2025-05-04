import {BACKEND_URL} from "@utils/constants";

export async function POST(req: Request) {
    const reqbody = await req.json();

    const refreshToken = reqbody.refresh;

    if (!refreshToken) return new Response('No refresh token', { status: 401 });
    const res = await fetch(`${BACKEND_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) return new Response('Refresh failed', { status: 401 });

    const tokens = await res.json();

    return new Response(JSON.stringify(tokens), { status: 200, headers: { 'Content-Type': 'application/json' } });
}