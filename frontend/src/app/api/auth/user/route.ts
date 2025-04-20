import {getUser} from "@utils/auth/auth";
import {NextResponse} from "next/server";

export async function GET() {
    const user = await getUser();
    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 } as ResponseInit,
        );
    }
    return NextResponse.json(user);
}