import {getRefreshToken, setAccessToken} from "@utils/auth/auth";
import {BACKEND_URL} from "@utils/constants";

export async function POST() {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) return new Response('No refresh token', { status: 401 });

    const res = await fetch(`${BACKEND_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) return new Response('Refresh failed', { status: 401 });

    const { access } = await res.json();
    await setAccessToken(access);

    return new Response('Refreshed');
}