"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Page() {

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); 
    const router = useRouter()
    let access_token = "";
    if (typeof window !== "undefined" && localStorage) access_token = localStorage.getItem("access_token") ?? "";
    
    async function handlePublish() {
        setLoading(true)
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog`, {
            title,
            content,
            published: true
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        setLoading(false);
        if (data.status === 201) {
            router.push("/blogs");
        }
    }

    useEffect(() => {
        if (access_token === "") {
            router.push("/")
        }
    }, [access_token,router])

    return (
        <div className="w-full h-full bg-slate-50 flex items-center p-5">
            <div className="flex h-full flex-col border-slate-50 p-3 bg-white border-2 w-full rounded-md">
                <Label htmlFor="title" className="text-2xl font-semibold px-1">Title</Label>
                <Input
                    id="title"
                    type="text"
                    className="w-full text-xl placeholder:text-xl font-semibold p-4 my-2"
                    placeholder="Your Blog Title"
                    onChange={(event:ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                />
                <Textarea
                    placeholder="Write your content here..."
                    className="w-full h-full text-lg placeholder:text-lg my-2"
                    onChange={(event:ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                />
                <Button
                    size="lg"
                    className="w-[10%] my-2 bg-green-500 rounded-md text-white font-semibold"
                    onClick={handlePublish}
                >
                    {loading ? "Publishing..." : "Publish"}
                </Button>
            </div>            
        </div>
    )
}