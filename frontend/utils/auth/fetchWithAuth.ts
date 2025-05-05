'use server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { BACKEND_URL } from '@utils/constants'

export async function fetchWithAuth(
    path: string,
    init: RequestInit = {},
    retry = 0
) {
    const cookieStore = await cookies()
    const access = cookieStore.get('access_token')?.value
    if (!access) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let res = await fetch(`${BACKEND_URL}${path}`, {
        ...init,
        headers: {
            ...init.headers as Record<string, string>,
            Authorization: `Bearer ${access}`,
        },
    })

    // при истёкшем токене пробуем обновить
    if (res.status === 401 && retry < 1) {
        const refresh = cookieStore.get('refresh_token')?.value
        if (!refresh) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }
        const refreshRes = await fetch(`${BACKEND_URL}/api/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
        })
        if (!refreshRes.ok) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }
        const { access: newA, refresh: newR } = await refreshRes.json()
        cookieStore.set('access_token', newA, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' })
        cookieStore.set('refresh_token', newR, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' })
        return fetchWithAuth(path, init, retry + 1)
    }

    if (!res.ok) {
        return NextResponse.json({ error: 'Backend error' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
}