import {Permission} from "@utils/types/user";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";
import {NextResponse} from "next/server";

async function fetchAllPermissions(): Promise<Permission[]> {
    let url = '/api/auth/permissions/';
    let allPermissions: Permission[] = [];

    while (url) {
        const res = await fetchWithAuth(url);

        if (!res.ok) {
            throw new Error(`Ошибка бэкенда: ${res.status}`);
        }

        const data = await res.json();
        allPermissions = [...allPermissions, ...data.results];

        if (data.next) {
            const nextUrl = new URL(data.next);
            url = nextUrl.pathname + nextUrl.search;
        } else {
            url = '';
        }
    }

    return allPermissions;
}

export async function GET() {
    try {
        const allPermissions = await fetchAllPermissions();

        return NextResponse.json(allPermissions, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('error:', error);
        return NextResponse.json("error", { status: 500 });
    }
}