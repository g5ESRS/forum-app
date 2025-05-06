import {BACKEND_URL} from "@utils/constants";
import {fetchWithAuth} from "@utils/auth/fetchWithAuth";

export async function GET(
    request: Request,
    {params}: { params: Promise<{ id: string }> }
){
    const { id } = await params;

    const res = await fetch(`${BACKEND_URL}/api/forum/categories/${id}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        return new Response("Server error", { status: 502 });
    }

    let category;
    try {
        category = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(category), { status: 200 });

}


export async function PATCH(
    request: Request,
    {params}: {params: Promise<{id: string}>}
){
    const {id} = await params;

    const newJSON = await request.text()
    const res = await fetchWithAuth(`/api/forum/categories/${id}/`, {
        method: 'PATCH',
        body: newJSON,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        return new Response("Server error", { status: 502 });
    }

    let category;
    try {
        category = await res.json();
    } catch {
        return new Response("Invalid response from backend", { status: 502 });
    }

    return new Response(JSON.stringify(category), { status: 200 });
}

export async function DELETE(
    request: Request,
    {params}: {params: Promise<{id: string}>}
){
    const {id} = await params;

    await fetchWithAuth(`/api/forum/categories/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return new Response(null, { status: 204 });
}