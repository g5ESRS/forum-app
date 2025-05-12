import {fetchWithAuth} from "@utils/auth/fetchWithAuth";
import {NextResponse} from "next/server";
import {UserDetails} from "@utils/types/user";


async function fetchAllUsers(): Promise<UserDetails[]> {
    let url = '/api/auth/users/';
    let allUsers: UserDetails[] = [];

    while (url) {
        const res = await fetchWithAuth(url);

        if (!res.ok) {
            throw new Error(`Ошибка бэкенда: ${res.status}`);
        }

        const data = await res.json();
        allUsers = [...allUsers, ...data.results];

        if (data.next) {
            const nextUrl = new URL(data.next);
            url = nextUrl.pathname + nextUrl.search;
        } else {
            url = '';
        }
    }

    return allUsers;
}

export async function GET() {
    try {
        const allUsers = await fetchAllUsers();

        return NextResponse.json(allUsers, {
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