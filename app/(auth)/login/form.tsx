'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormEvent } from 'react';
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Form() {
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        e.preventDefault();
        const response = await signIn("credentials", {
            username: formData.get('email'),
            redirect: false,
        })
        console.log(response);
        if(!response?.error){
            router.push("/")
            router.refresh();
        }

     }
 return (
    <form onSubmit={handleSubmit}>
  <Card className='mx-auto max-w-sm border-0 shadow-none mt-4 sm:mt-12 sm:border sm:shadow-sm md:mt-20 lg:mt-24 xl:mt-28'>
   <CardHeader>
    <CardTitle className='text-2xl'>Login</CardTitle>
    <CardDescription>Enter your email below to login to your account</CardDescription>
   </CardHeader>
   <CardContent>
    <div className='grid gap-4'>
     <div className='grid gap-2'>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' name='email' placeholder='m@example.com' />
     </div>
     <Button type="submit">Login</Button>
     <Button variant='outline'>Login with Google</Button>
    </div>
    <div className='mt-4 text-center text-sm'>
     Don&apos;t have an account?{' '}
     <Link href='/register' className='underline'>
      Sign up
     </Link>
    </div>
   </CardContent>
  </Card>
  </form>
 )
}