'use client'
import LoginForm from './login-form';
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="page">
            <div className="registerLogo w-1/2 max-w-xs mx-auto relative">
                <Image
                    src="/images/ubuLogoBlack.png" // Assume a single logo for simplicity
                    alt="Ubunation Logo"
                    width={1500}
                    height={1000}
                />
            </div>
            <h1 className="text-center text-2xl font-bold mt-8">Admin Login</h1>
            <LoginForm />
        </div>
    );
}