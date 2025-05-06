import { BACKEND_URL } from "@utils/constants";
import { setAuthCookies } from "@utils/auth/auth";
import { BaseUser } from "@utils/types/user";
import { handleErrorResponse } from "@utils/handleErrorResponse";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    let body: unknown;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/auth/registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        let errorResponse: unknown;
        try {
            errorResponse = await res.json();
        } catch {
            return NextResponse.json({ error: "Invalid backend response" }, { status: 502 });
        }

        return handleErrorResponse(res, errorResponse);
    }

    let result: { access: string; refresh: string; user: BaseUser };

    try {
        result = await res.json();
    } catch {
        return NextResponse.json({ error: "Invalid backend response" }, { status: 502 });
    }

    const { access, refresh, user } = result;
    try {
        await setAuthCookies(access, refresh, user);
    } catch  {
        return NextResponse.json({ error: "Failed to set authentication cookies" }, { status: 500 });
    }

    return NextResponse.json({ user }, { status: 200 });
}