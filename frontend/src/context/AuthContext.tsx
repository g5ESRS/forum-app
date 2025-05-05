// frontend/src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { BaseUser } from '@utils/types/user'

type AuthContextType = {
    user: BaseUser | null
    loading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => ({ success: false }),
    logout: async () => {},
    refreshUser: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<BaseUser | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/user', {
                method: 'GET',
                credentials: 'include',
            })
            if (res.ok) {
                setUser(await res.json())
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshUser()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (res.status === 401) {
                return { success: false, error: 'Неверный email или пароль.' }
            }
            if (!res.ok) {
                return { success: false, error: 'Произошла ошибка. Попробуйте ещё раз.' }
            }

            await refreshUser()
            return { success: true }
        } catch {
            return { success: false, error: 'Сервер недоступен. Попробуйте позже.' }
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
            setUser(null)
        } catch {

        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)