
"use client";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react"
import { api } from '../../api/axios';
export type UserType = {
    role: "admin" | "user",
    username: string
}
const AuthContext = React.createContext<{
    user?: UserType,
    signIn?: (email: string, password: string) => void,
    logOut?: () => void,
    loading?: boolean
}>({

})
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userData, setUserData] = useState<UserType>()
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        async function fetchUser() {
            const token = Cookies.get('token')
            if (token) {
                api.defaults.headers.Authorization = `Bearer ${token}`
                const { data: user } = await api.get('auth/profile')
                if (user) setUserData(user)

            }
            setIsLoading(false)
        }
        fetchUser()
    }, [])
    useEffect(() => {
        if (!isLoading && !userData) router.push("/login")
    }, [isLoading])
    if (isLoading) {
        return <main className="min-h-dvh flex justify-center items-center font-bold text-3xl">
            <p>Загрузка</p>
        </main>
    }
    return (<AuthContext.Provider value={{
        user: userData,
        loading: isLoading,
        logOut() {
            Cookies.remove('token')
            setUserData(undefined)
            delete api.defaults.headers.Authorization
            router.push("/login")
        },
    }}>
        {children}
    </AuthContext.Provider>)
}
export const useAuth = () => useContext(AuthContext)