"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { signinInput } from 'quillspace_v1';
import React, { ChangeEvent, useState } from 'react'

export default function Home() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()

    async function handleSignin() {
        setLoading(true)
        const { success } = signinInput.safeParse({ email: email, password: password })
        if (!success) {
            alert("INCORRECT INPUT")
            setLoading(false)
            return
        }
        try {
            const {data} = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signin`, {
                email,
                password
            })
            if (typeof window !== "undefined" && localStorage) {
                localStorage.setItem("access_token", data?.jwt);
                localStorage.setItem("user", data?.user);
            } 
            setLoading(false)
            router.push("/blogs")
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="md:w-1/2 w-full h-full flex justify-center items-center flex-col">
                <h1 className="text-4xl font-bold italic md:hidden">Quill Space</h1>
                <div className="w-1/2 flex flex-col mx-auto my-2">
                    <Label htmlFor="email" className="my-1 text-lg">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="johndoe@quillspace.co"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        required />
                </div>
                <div className="w-1/2 flex flex-col mx-auto my-2">
                    <Label htmlFor="password" className="my-1 text-lg">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="password"
                        onChange={(event:ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        required />
                </div>
                <Button size="lg" onClick={handleSignin} className="mt-5 w-1/2 mx-auto text-lg">{loading ? "Signing in..." : "Sign in"}</Button>
                <p className="my-2 italic font-extralight text-sm">Don&apos;t have an account? <Link href="/" className="font-bold">Sign Up</Link></p>
            </div>
            <div className="hidden w-1/2 h-full md:flex justify-center border-2 rounded-md items-center flex-col">
                <h1 className="text-4xl font-bold italic">Quill Space</h1>
            </div>
        </div>
    )
}
