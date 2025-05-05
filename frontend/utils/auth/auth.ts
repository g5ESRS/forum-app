'use server'

import { cookies } from 'next/headers';
import {BaseUser} from "@utils/types/user";

export async function setAuthCookies(access: string, refresh: string, user: BaseUser) {
    const cookieStore: any = await cookies();
    cookieStore.set('access_token', access, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    cookieStore.set('refresh_token', refresh, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    cookieStore.set('user', JSON.stringify(user))
}

export async function getAccessToken() {
    const cookieStore: any = await cookies();

    return cookieStore.get('access_token')?.value || null;
}

export async function getRefreshToken() {
    const cookieStore: any = await cookies();

    return cookieStore.get('refresh_token')?.value || null;
}

export async function setRefreshToken(token: string) {
    const cookieStore: any = await cookies();

    cookieStore.set('refresh_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',

    });
}

export async function setAccessToken(token: string) {
    const cookieStore: any = await cookies();

    cookieStore.set('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
    });
}

export async function clearAuthCookies() {
    const cookieStore:any = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    cookieStore.delete('user');
}
