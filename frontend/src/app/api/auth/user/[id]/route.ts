import {BACKEND_URL} from "@utils/constants";
import {NextRequest} from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
)  {
    const { id } = await params;
    const res = await fetch(`${BACKEND_URL}/api/auth/users/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        console.error("Backend error:", await res.text());
        return new Response("Server error", { status: 502 });
    }

    let user;
    try {
        user = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
}