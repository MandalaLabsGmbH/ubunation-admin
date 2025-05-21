'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { cognitoRegister, generateId } from '@/app/_helpers/registerHelpers';

export default function Form() {
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const pw = generateId(25);
        const formEmail = formData.get('email') as string;
        const response = await cognitoRegister(formEmail, pw);
        if(response.toString() === 'success') {
            console.log('cognito response: ' + response.toString())
            router.push(`/confirmRegister?email=${formData.get('email')}&password=${pw}`);
        }
        else {
            console.log('register fail: ' + response.toString())
        }
        
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