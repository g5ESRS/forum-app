import { fetchWithAuth } from "@utils/auth/fetchWithAuth";

export async function POST(request: Request) {
    return fetchWithAuth("/api/forum/topics/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(await request.json()),
    });
}