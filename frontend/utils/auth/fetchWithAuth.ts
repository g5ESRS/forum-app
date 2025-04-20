export async function fetchWithAuth(path: string, init: RequestInit = {}) {
    const res = await fetch(path, {
        ...init,
        credentials: 'include',
    });

    if (res.status === 401) {
        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
        if (!refreshRes.ok) throw new Error('Unauthorized');

        return fetch(path, {
            ...init,
            credentials: 'include',
        });
    }

    return res;
}
