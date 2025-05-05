import {BACKEND_URL} from "@utils/constants";
import {setAuthCookies} from "@utils/auth/auth";
import {BaseUser} from "@utils/types/user";

export async function POST(req: Request) {
    let body: unknown;

    try {
        body = await req.json();
    } catch {
        return new Response("Invalid JSON", {status: 400});
    }

    const res = await fetch(`${BACKEND_URL}/api/auth/registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (res.status === 400) return new Response('Bad Request', { status: 400 });

    if (!res.ok) {
        console.error("Backend error:", await res.text());
        return new Response("Server error", { status: 502 });
    }

    let result: { access: string; refresh: string; user: BaseUser };

    try {
        result = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    const { access, refresh, user } = result;
    try {
        await setAuthCookies(access, refresh, user);
    } catch (err) {
        console.error("Failed to set cookies:", err);
        return new Response("Failed to set authentication cookies", { status: 500 });
    }

    return Response.json({ result });
}