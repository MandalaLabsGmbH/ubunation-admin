'use client'

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    return (
        <button 
            onClick={() => signOut({ callbackUrl: '/' })} // Redirect to root after logout
            className="font-semibold hover:text-gray-700 transition-colors"
        >
            Logout
        </button>
    )
}