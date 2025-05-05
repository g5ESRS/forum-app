import { fetchWithAuth } from '@utils/auth/fetchWithAuth'

export async function GET(req: Request) {
    const cookies = req.headers.get('cookie')

    console.log('Cookies:', cookies)

    return fetchWithAuth('/api/auth/user')
}