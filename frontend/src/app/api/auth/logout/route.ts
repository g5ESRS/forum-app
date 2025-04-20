import {clearAuthCookies} from "@utils/auth/auth";

export async function POST() {
    await clearAuthCookies();

    return new Response('Logged out');
}