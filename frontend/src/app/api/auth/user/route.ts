import {NextResponse} from "next/server";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";
import {BACKEND_URL} from "@utils/constants";

export async function GET() {
    const res = await fetchWithAuth(`${BACKEND_URL}/api/auth/user`);

    if (!res.ok) {
        return NextResponse.json({error: 'Not authenticated'}, {status: 401});
    }

    const data = await res.json();
    if (!data) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    return NextResponse.json(data, {status: 200});
}