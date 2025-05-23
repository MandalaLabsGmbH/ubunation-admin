'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cognitoRegister, generateId } from '@/app/_helpers/registerHelpers';

export default function Form() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const pw = generateId(25);
        const formEmail = formData.get('email') as string;
        const formNlBox = formData.get('nlBox') as string;
        console.log(formNlBox);
        const response = await cognitoRegister(formEmail, pw);
        if(response.toString() === 'success') {
            console.log('cognito response: ' + response.toString());
             router.push(`/confirmRegister?email=${formData.get('email')}&password=${pw}`);
            // const postResponse = await fetch('/api/auth/register', {
            // method: 'POST',
            // body: JSON.stringify({
            //     email: formData.get('email'),
            //     password: pw,
            //     nlBox: formData.get('nlBox'),
            // }),
        // });
            // console.log('postResponse: ')
            // if(postResponse.status === 200) {
            //     router.push(`/confirmRegister?email=${formData.get('email')}&password=${pw}`);
        //     }
        //     else {
        //         console.log('db fail: ' + postResponse.statusText);
        //     }
        // }
        // else {
        //     console.log('register fail: ' + response.toString())
        // }
        }
     }
    return (
        <form onSubmit={handleSubmit}>
            <Card className=' pt-0 mx-auto max-w-sm border-0 shadow-none mt-8'>
            <CardHeader>
                <CardDescription className="flex justify-center items-center">Jezt anmelden und Gewinnchance sichern.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-4'>
                <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' autoComplete='on' placeholder='m@example.com' required />
                </div>
                <div className='grid gap-2'>
                <div className="flex items-center space-x-2">
                    <Checkbox defaultChecked id="nlBox" name="nlBox">
                    </Checkbox>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="nlBox">
                        Ich möchte den DEINS-Newsletter abonnieren
                    </label>
		        </div>
                </div>
                {!loading &&
                    <Button type="submit">Ein Konto erstellen</Button>
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