import { clearAuthCookies } from '@utils/auth/auth'
import { fetchWithAuth } from '@utils/auth/fetchWithAuth'

export async function POST() {
    await clearAuthCookies()
    return fetchWithAuth('/api/auth/logout', { method: 'POST' })
}