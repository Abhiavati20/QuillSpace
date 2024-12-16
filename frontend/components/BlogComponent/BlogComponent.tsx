"use client";
import { BLOG } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button';

export const BlogComponent = ({blog, key}:{blog:BLOG, key: number}) => {
    const router = useRouter()
    return (
        <>
            {
                blog.published && 
                <div key={key} onClick={() => router.push(`blogs/${blog.id}`)} className="cursor-pointer flex p-5 flex-col  w-full my-2 border-2 rounded-md">
                    <h1 className="w-full text-lg font-semibold">{blog.title}</h1>
                    <span className="w-full"></span>
                    <p className="w-full my-2">{blog.content.length > 15 ? `${blog.content.substring(0, 15)}...`: blog.content}</p>
                    <Button size="sm" onClick={() => router.push(`blogs/${blog.id}`)} className="w-20" variant="outline">Read more</Button>
                </div>    
            }
        </>
    )
}
