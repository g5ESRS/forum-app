import { fetchWithAuth } from '@utils/auth/fetchWithAuth'

export async function GET() {
    return fetchWithAuth('/api/auth/user')
}