'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormEvent } from 'react';
import Link from 'next/link'

export default function Form() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
     <div className='grid gap-2'>
      <div className='flex items-center'>
       <Label htmlFor='password'>Password</Label>
       <Link href='/forgot' className='ml-auto inline-block text-sm underline'>
        Forgot your password?
       </Link>
      </div>
      <Input id='password' name='password' type='password' />
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