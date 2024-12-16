"use client";
import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
    let storeduser = null;
    if (typeof window !== "undefined" && localStorage) storeduser = localStorage.getItem("access_token")??"";
    let user = null
    if (storeduser) {
        try {
            user = JSON.parse(storeduser)
        } catch (error) {
            console.log("ERROR", error)
        }
    }
    const router = useRouter();
    const pathName = usePathname();
    
    const validPathName = pathName === "/" || pathName === "/signin"
    function handleLogout() {
        router.push("/");
    }
    
    return (
        <div className="w-full p-5 flex justify-between border-2 rounded-md mb-4">
            <h1 className="text-3xl font-semibold">Quill Space</h1>
            <div className="flex justify-end items-center gap-3">
                <Link href="/publish" className="bg-green-400 rounded-lg px-2 py-1 flex justify-center items-center text-white">Publish</Link>
                {user && <span>{user?.name ? user?.name : user?.email}</span>}
                {!validPathName && <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>}
            </div>
        </div>
    )
}

export default Navbar