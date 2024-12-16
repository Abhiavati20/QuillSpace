"use client";
import { BlogComponent } from "@/components/BlogComponent/BlogComponent";
import Navbar from "@/components/Navbar/Navbar";
import { BLOG } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"


export default function Home() {
    const [blogs, setBlogs] = useState<BLOG[]>([]);
    const router = useRouter();
    let access_token = "";
    if (typeof window !== "undefined" && localStorage) access_token = localStorage.getItem("access_token")??"";
    async function fetchBlogs() {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blogs`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        setBlogs(data.blogs);
    }    

    useEffect(() => {
        if (access_token === "") {
            router.push("/signin")
            return
        }
        fetchBlogs()
    }, [])
    return (
        <>
            <Navbar />
            <div className="flex w-full h-full justify-center items-center">
                {
                    blogs.length === 0
                        ? "Loading..." :
                        <div className="w-3/4 mt-4 mx-auto flex flex-col justify-center items-center">
                            {blogs.map((blog, index) =>
                                <BlogComponent
                                    key={index}
                                    blog={blog}
                                />
                            )}
                        </div>
                }
            </div>
        </>
    )
}