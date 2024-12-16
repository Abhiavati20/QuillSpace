import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BLOG {
    id: string,
    title: string,
    content: string,
    published: boolean,
    authorId: string,
}