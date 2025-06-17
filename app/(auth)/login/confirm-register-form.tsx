'use client'

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from "lucide-react";
import { cognitoConfirm } from '@/app/_helpers/registerHelpers';

interface ConfirmRegisterFormProps {
    email: string;
    password: string; // Password is now passed as a prop
}

// This function was in your original file
async function submitUserCollectible(email: string) {
    try {
        const userRes = await fetch(`/api/db/user?email=${email}`);
        if (!userRes.ok) throw new Error("Failed to get user");
        const userData = await userRes.json();
        const userId = userData.userId;
        const randomInt = Math.floor(Math.random() * 14) + 1;
        await fetch(`/api/db/userCollectible`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                collectibleId: randomInt,
                mint: userId,
            })
        });
    } catch (error) {
        console.error("Error submitting user collectible:", error);
    }
}

export default function ConfirmRegisterForm({ email, password }: ConfirmRegisterFormProps) {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);
        const formData = new FormData(e.currentTarget);
        const confCode = formData.get('confirmCode')?.toString() || '';

        try {
            // 1. Confirm the user in Cognito
            await cognitoConfirm(email, confCode);

            // 2. Assign a collectible to the user
            await submitUserCollectible(email);

            // 3. Sign the user in using the email and password from props
            const loginResponse = await signIn("credentials", {
                username: email,
                password: password, // Use the password from props
                redirect: false,
            });

            if (loginResponse?.error) {
                throw new Error("Login failed after confirmation.");
            } else {
                router.push("/main");
                router.refresh();
            }
        } catch (error) {
            console.error("Confirmation or login error:", error);
            setLoading(false);
            setShowError(true);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className='mx-auto max-w-sm border-0 shadow-none sm:border sm:shadow-sm mt-8'>
                <CardHeader>
                    <CardTitle className='text-xl'>Confirm your email</CardTitle>
                    <CardDescription>Enter the code from your email to finish signing up.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='confirmCode'>Confirmation Code</Label>
                            <Input id='confirmCode' name='confirmCode' placeholder='123456' required />
                        </div>
                        {!loading ? (
                            <Button className="w-full" type="submit">Confirm & Login</Button>
                        ) : (
                            <Button className="w-full" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        )}
                        {!!showError &&
                            <p className="text-sm font-medium text-destructive text-center">
                                Confirmation failed. Please check the code and try again.
                            </p>
                        }
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}