/* eslint-disable @next/next/no-async-client-component */
"use client";

import { BLOG } from "@/lib/utils";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const {slug} = useParams();
    const router = useRouter();
    let access_token = "";
    if (typeof window !== "undefined" && localStorage) access_token = localStorage.getItem("access_token")??"";
    const [blog, setBlog] = useState<BLOG | null>(null)
    
    async function fetchBlog() {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/${slug}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        setBlog(data.blog);
    }
    
    useEffect(() => {
        if (access_token === "") {
            router.push("/signin")
            return
        }
        fetchBlog()
    }, [])


    return (
        <div className="flex p-5 w-full mx-auto justify-center items-center">
            {
                !blog ? "Loading..." :
                    <div className="flex w-full border-2 flex-col p-5 rounded-md">
                        <h1 className="my-2 text-4xl font-semibold">{blog.title} <span className="bg-green-400 text-sm rounded-full px-2 py-1 text-white font-semibold">{blog.published ? "Published": "Not Published"}</span></h1>
                        <p className="my-2 text-lg font-normal">{blog.content}</p>
                        <span className="text-md font-semibold">Author ID: {blog.authorId}</span>
                    </div>
            }
        </div>
    )
}