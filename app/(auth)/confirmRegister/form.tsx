'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, useState } from 'react';
import { cognitoConfirm } from '@/app/_helpers/registerHelpers';
import { useSearchParams } from 'next/navigation'
// import axios from 'axios';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'


async function submitUserCollectible(email:string) {
  await fetch(`/api/db/user?email=${email}`, {
            method: 'GET'
  }).then(async (response) => {
    await fetch(`/api/db/userCollectible`, {
            method: 'POST',
            body: JSON.stringify({
                userId: response,
                collectibleId: 1,
                mint: 2,
    })
    }).catch((error) => {
        return error;
    })
  })
}

export default function Form() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const getEmail = searchParams.get('email') || 'no email';
    // const getPass = searchParams.get('password');
    const router = useRouter();
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const check = await submitUserCollectible(getEmail);
        console.log(JSON.stringify(check));
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
            <Card className='mx-auto max-w-sm border-0 shadow-none sm:border sm:shadow-sm mt-8'>
            <CardHeader>
                <CardTitle className='text-xl'>Anmelden</CardTitle>
                <CardDescription>Bitte geben Sie den Bestätigungscode aus Ihrer E-Mail ein, um fortzufahren.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-4'>
                <div className='grid gap-2'>
                <Label htmlFor='confirmCode'>Bestätigungscode</Label>
                <Input id='confirmCode' name='confirmCode' placeholder='12345' />
                </div>
                {!loading &&
                    <Button type="submit">Vervollständigen Registrierung</Button>
                }
                {!!loading &&
                    <Button disabled>
                        <Loader2 className="animate-spin" /> 
                        Bitte warten
                        </Button>
                }
                </div>
            </CardContent>
            </Card>
        </form>
    )

}