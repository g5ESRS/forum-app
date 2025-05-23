import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value

    if (token === undefined) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/profile', '/profile/:path*'],
}