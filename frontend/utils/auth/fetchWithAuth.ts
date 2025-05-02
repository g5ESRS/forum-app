import {BACKEND_URL} from "@utils/constants";
import {getAccessToken, getRefreshToken} from "@utils/auth/auth";
import {NextResponse} from "next/server";

export async function fetchWithAuth(path: string, init: RequestInit = {}, count:number = 0) {
    const res = await fetch(path, {
        ...init,
        credentials: 'include',
        headers: {
            ...init.headers,
            "Authorization": `Bearer ${await getAccessToken()}`,
        },
        cache: 'no-store',
    });


    if (!res.ok) {
        if (await getRefreshToken() == null) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getRefreshToken()}`,
            },
            cache: 'no-store',
        });
        if (!refreshRes.ok) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        if (count > 4) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        return fetchWithAuth(path, init, count + 1);
    }

    let data = await res.json();

    if (!data) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
}
