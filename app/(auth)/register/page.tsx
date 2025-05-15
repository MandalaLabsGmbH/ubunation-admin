import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function RegisterPage() {
 return (
  <Card className='mx-auto max-w-sm border-0 shadow-none mt-4 sm:mt-12 sm:border sm:shadow-sm md:mt-20 lg:mt-24 xl:mt-28'>
   <CardHeader>
    <CardTitle className='text-xl'>Sign Up</CardTitle>
    <CardDescription>Enter your information to create an account</CardDescription>
   </CardHeader>
   <CardContent>
    <div className='grid gap-4'>
     <div className='grid grid-cols-2 gap-4'>
      <div className='grid gap-2'>
       <Label htmlFor='firstName'>First name</Label>
       <Input id='firstName' name='firstName' placeholder='Max' />
      </div>
      <div className='grid gap-2'>
       <Label htmlFor='lastName'>Last name</Label>
       <Input id='lastName' name='lastName' placeholder='Robinson' />
      </div>
     </div>
     <div className='grid gap-2'>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' name='email' placeholder='m@example.com' />
     </div>
     <div className='grid gap-2'>
      <Label htmlFor='password'>Password</Label>
      <Input id='password' name='password' type='password' />
     </div>
     <div className='grid gap-2'>
      <Label htmlFor='confirmPassword'>Confirm password</Label>
      <Input id='confirmPassword' name='confirmPassword' type='password' />
     </div>
     <Button>Create an account</Button>
    </div>
    <div className='mt-4 text-center text-sm'>
     Already have an account?{' '}
     <Link href='/login' className='underline'>
      Sign in
     </Link>
    </div>
   </CardContent>
  </Card>
 )
}