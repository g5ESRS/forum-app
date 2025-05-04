// frontend/src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { fetchWithAuth } from "@utils/auth/fetchWithAuth";
import { BaseUser } from "@utils/types/user";

type AuthContextType = {
    user: BaseUser | null
    loading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean, error?: string }>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => ({ success: false }),
    logout: async () => {},
    refreshUser: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<BaseUser | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshUser = async () => {
        try {
            console.log("Fetching user data")
            const response = await fetchWithAuth(`/api/auth/user`)

            if (response.status === 200) {
                setUser(await response.json())
            } else {
                console.error(`Auth failed with status: ${response.status}`)
                setUser(null)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error)
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 401) {
                return { success: false, error: "Incorrect email or password." };
            }

            if (!res.ok) {
                return { success: false, error: "An unexpected error occurred. Please try again." };
            }

            await refreshUser();
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, error: "Failed to connect to server. Please try again later." };
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (err) {
            console.error('Failed to logout:', err);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)