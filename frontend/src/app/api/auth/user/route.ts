import { fetchWithAuth } from '@utils/auth/fetchWithAuth'

export async function GET(req: Request) {
    return fetchWithAuth('/api/auth/user')
}