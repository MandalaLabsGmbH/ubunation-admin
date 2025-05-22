'use client'

import { signOut } from "next-auth/react"
import Head from 'next/head';

export default function Logout() {
    return (
        <button onClick={() => {
            signOut();
        }}>
            Logout
        </button>
    )
}