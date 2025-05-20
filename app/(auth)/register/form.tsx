'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEvent } from 'react';
import router from 'next/navigation';

export default function Form() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                nlBox: formData.get('nlBox'),
                tcBox: formData.get('tcBox'),
            }),
        });
        console.log(formData.get('nlBox'))
        console.log(response);
        router.redirect('confirmRegister')
     }
    return (
        <form onSubmit={handleSubmit}>
            <Card className=' pt-0 mx-auto max-w-sm border-0 shadow-none mt-4 sm:mt-12 md:mt-20 lg:mt-24 xl:mt-28'>
            <CardHeader>
                <CardDescription className="flex justify-center items-center">Jezt anmelden und Gewinnchance sichern.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-4'>
                <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' placeholder='m@example.com' required />
                </div>
                <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' name='password' type='password' required />
                </div>
                <div className='grid gap-2'>
                <div className="flex items-center space-x-2">
                    <Checkbox defaultChecked id="nlBox" name="nlBox">
                    </Checkbox>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="nlBox">
                        I want to sign up for the DEINS Newsletter
                    </label>
		        </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="tcBox" name="tcBox" required>
                    </Checkbox>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="tcBox">
                        I have read and agree to the <a className="underline" href="https://www.deins.io">Terms & Conditions</a>
                    </label>
		        </div>
                </div>
                <Button type="submit">Create an account</Button>
                </div>
            </CardContent>
            </Card>
        </form>
    )

}