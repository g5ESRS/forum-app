
import {Group} from "@utils/types/user";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";
import {NextResponse} from "next/server";

async function fetchAllGroups(): Promise<Group[]> {
    let url = '/api/auth/groups/';
    let allGroup: Group[] = [];

    while (url) {
        const res = await fetchWithAuth(url);

        if (!res.ok) {
            throw new Error(`Ошибка бэкенда: ${res.status}`);
        }

        const data = await res.json();
        allGroup = [...allGroup, ...data.results];

        if (data.next) {
            const nextUrl = new URL(data.next);
            url = nextUrl.pathname + nextUrl.search;
        } else {
            url = '';
        }
    }

    return allGroup;
}

export async function GET() {
    try {
        const allGroups = await fetchAllGroups();

        return NextResponse.json(allGroups, {
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

export async function POST(req: Request) {
    const newJSON = await req.text()
    const res = await fetchWithAuth(`/api/auth/groups/`, {
        method: 'POST',
        body: newJSON,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    let body: unknown;

    try {
        body = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(body), {status: 200})
}