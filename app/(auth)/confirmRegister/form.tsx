'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';
import { cognitoConfirm } from '@/app/_helpers/registerHelpers';
import { useSearchParams } from 'next/navigation'
// import axios from 'axios';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Form() {
    const searchParams = useSearchParams();
    const getEmail = searchParams.get('email') || 'no email';
    // const getPass = searchParams.get('password');
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const confCode = formData.get('confirmCode')?.toString() || 'no code';
        // const cookieResponse = await fetch('/api/cookies');
        // const data = await cookieResponse.json();
        // console.log(data);
        await cognitoConfirm(getEmail, confCode)
        .then( async (response) => {
            console.log(response);
            const loginResponse = await signIn("credentials", {
                    username: getEmail,
                    redirect: false,
                })
            console.log('login response:')
            console.log(loginResponse);
                if(!loginResponse?.error){
                    router.push("/")
                    router.refresh();
                }
        })
     }
    return (
        <form onSubmit={handleSubmit}>
            <Card className='mx-auto max-w-sm border-0 shadow-none mt-4 sm:mt-12 sm:border sm:shadow-sm md:mt-20 lg:mt-24 xl:mt-28'>
            <CardHeader>
                <CardTitle className='text-xl'>Sign Up</CardTitle>
                <CardDescription>Please enter the confirmation code found in your email to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-4'>
                <div className='grid gap-2'>
                <Label htmlFor='confirmCode'>Confirmation Code</Label>
                <Input id='confirmCode' name='confirmCode' placeholder='12345' />
                </div>
                <Button type="submit">Create an account</Button>
                </div>
            </CardContent>
            </Card>
        </form>
    )

}