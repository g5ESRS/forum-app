'use server';

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { BACKEND_URL } from '@utils/constants'
import {setAuthCookies} from "@utils/auth/auth";
import {handleErrorResponse} from "@utils/handleErrorResponse";

export async function fetchWithAuth(
    path: string,
    init: RequestInit = {},
    retry = 0,
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
            return handleErrorResponse(refreshRes, await refreshRes.json())
        }
        const { access: newA, refresh: newR } = await refreshRes.json()
        setAuthCookies(newA, newR, { access: newA, refresh: newR })
        return fetchWithAuth(path, init, retry + 1)
    }

    if (!res.ok) {
        return handleErrorResponse(res, await res.json())
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
}