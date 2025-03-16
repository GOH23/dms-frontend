"use client"

import axios from "axios";
import { useAnimate, motion } from "framer-motion";

import { useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { Button, Form, Input } from "antd";
import { useAuth } from "./context/authContext";
export function LoginPageUi() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {user} = useAuth()
    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.BACKEND_URI}/auth/login`, {
                email,
                password,
            });
            if(!res.data.access_token) return;
            Cookies.set('token', res.data.access_token);
            router.push('/');
        } catch (error: any) {
            console.error('Login failed:', error.response.data);
        }
    };
    useEffect(()=>{
        if(user) router.push("/")
    },[])
    return (<main className="min-h-dvh flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
            <motion.p initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{
                duration: 2
            }} className="text-3xl font-bold">Приветствую вас</motion.p>
            <motion.p initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{
                duration: 2
            }} className="text-xl font-bold">Форма входа</motion.p>
            <form className="flex justify-center flex-col gap-y-2 w-[300px]" onSubmit={handleSubmit}
            >
                <Input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input.Password
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button htmlType="submit" type="primary">Войти</Button>
            </form>

        </div>
    </main>)
}