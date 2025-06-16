'use client'

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from "lucide-react";
import { cognitoRegister } from '@/app/_helpers/registerHelpers';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

interface RegisterFormProps {
    onRegisterSuccess: (email: string, password: string) => void;
}

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);
        const formData = new FormData(e.currentTarget);
        const formEmail = formData.get('email') as string;
        const formPassword = formData.get('password') as string;
        const formNlBox = formData.get('nlBox') as string;
        
        try {
            // First, create user record in your database via your API
            await axios.post('/api/auth/register', {
                email: formEmail,
                password: formPassword,
                nlBox: formNlBox,
            });

            // Second, register the user in Cognito
            await cognitoRegister(formEmail, formPassword);

            // On success, call the callback to switch to the confirm view
            onRegisterSuccess(formEmail, formPassword);

        } catch (error) {
            console.error("Registration error:", error);
            setShowError(true);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className='mx-auto max-w-sm border-0 shadow-none sm:border sm:shadow-sm mt-8'>
                <CardHeader>
                    <CardTitle className='text-xl'>Create an account</CardTitle>
                    <CardDescription>Please enter your details to sign up.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input id='email' name='email' autoComplete='email' placeholder='m@example.com' required />
                        </div>
                         <div className='grid gap-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input id='password' name='password' type='password' required autoComplete='new-password' />
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Checkbox id="nlBox" name="nlBox" defaultChecked />
                            <label htmlFor="nlBox" className="text-sm font-medium leading-none">
                                I want to subscribe to the Kloppocar newsletter
                            </label>
                        </div>
                        {!loading ? (
                            <Button className="w-full" type="submit">Create account</Button>
                        ) : (
                            <Button className="w-full" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        )}
                        {!!showError &&
                            <p className="text-sm font-medium text-destructive text-center">
                                This email address is already registered.
                            </p>
                        }
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}