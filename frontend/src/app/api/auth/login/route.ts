import { NextResponse } from 'next/server'
import { BACKEND_URL } from '@utils/constants'
import { setAuthCookies } from '@utils/auth/auth'
import { BaseUser } from '@utils/types/user'

interface LoginResponse {
    access: string
    refresh: string
    user: BaseUser
}

export async function POST(request: Request) {
    let body: unknown

    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const res = await fetch(`${BACKEND_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    if (res.status === 401) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!res.ok) {
        console.error('Backend error:', await res.text())
        return NextResponse.json({ error: 'Server error' }, { status: 502 })
    }

    let result: LoginResponse
    try {
        result = await res.json()
    } catch {
        console.error('Failed to parse backend response:', await res.text())
        return NextResponse.json({ error: 'Invalid backend response' }, { status: 502 })
    }

    const { access, refresh, user } = result
    try {
        console.log('Setting auth cookies:', { access, refresh, user })
        await setAuthCookies(access, refresh, user)
    } catch (err) {
        console.error('Failed to set cookies:', err)
        return NextResponse.json({ error: 'Failed to set authentication cookies' }, { status: 500 })
    }

    return NextResponse.json({ user }, { status: 200 })
}