import {clearAuthCookies} from "@utils/auth/auth";
import {BACKEND_URL} from "@utils/constants";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";

export async function POST() {
    await clearAuthCookies();

    await fetchWithAuth(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    }).catch((err) => {
        console.error("Failed to logout:", err);
        return new Response("Failed to logout", { status: 500 });
    });

    return new Response('Logged out');
}