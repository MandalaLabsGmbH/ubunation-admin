'use client'

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        
        const response = await signIn("credentials", {
            username: formData.get('email'),
            password: formData.get('password'), // Password is required for the auth flow
            redirect: false,
        });

        setLoading(false);
        if (response?.error) {
            setError("Failed to login. Please check your credentials.");
            console.error(response.error);
        } else {
            router.push("/main");
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className='mx-auto max-w-sm border-0 shadow-none sm:border sm:shadow-sm mt-8'>
                <CardHeader>
                    <CardTitle className='text-xl'>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input id='email' name='email' placeholder='m@example.com' required autoComplete='email' />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input id='password' name='password' type='password' required autoComplete='current-password' />
                        </div>
                        {!loading ? (
                            <Button className='w-full' type="submit">Login</Button>
                        ) : (
                            <Button className='w-full' disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        )}
                        {!!error &&
                            <p className="text-sm font-medium text-destructive text-center">
                                {error}
                            </p>
                        }
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}