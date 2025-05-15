import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPage() {
 return (
  <Card className='mx-auto max-w-sm border-0 shadow-none mt-4 sm:mt-12 sm:border sm:shadow-sm md:mt-20 lg:mt-24 xl:mt-28'>
   <CardHeader>
    <CardTitle className='text-2xl'>Forgot Password</CardTitle>
    <CardDescription>Enter your email below to reset your password</CardDescription>
   </CardHeader>
   <CardContent>
    <div className='grid gap-4'>
     <div className='grid gap-2'>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' name='email' placeholder='m@example.com' />
     </div>
     <Button>Send verification</Button>
    </div>
    <div className='mt-4 text-center text-sm'>
     Remember your password?{' '}
     <Link href='/login' className='underline'>
      Sign in
     </Link>
    </div>
   </CardContent>
  </Card>
 )
}