import {NextRequest, NextResponse} from "next/server";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";
import {handleErrorResponse} from "@utils/handleErrorResponse";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
)  {
    const { id } = await params;
    const res = await fetchWithAuth(`/api/auth/users/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        return handleErrorResponse(res, await res.json());
    }

    let user;
    try {
        user = await res.json();
    } catch {
        return NextResponse.json({error: 'Failed to parse response'}, { status: 500 });
    }

    return NextResponse.json(user, { status: 200 });
}