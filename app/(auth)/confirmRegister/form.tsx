'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';
import axios from 'axios';
import {
	CognitoUserPool,
    CognitoUser,
    CookieStorage,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';
import router from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authenticateUser (email: any, password: any) {

    const poolId = "eu-central-1_flxgJwy19";
    const clientId = "3habrhuviqskit3ma595m5dp0b";

    console.log(poolId, clientId);

    const poolData = {
        UserPoolId: poolId ? poolId : 'no Cognito poolId found', // Your user pool id here
        ClientId: clientId ? clientId : 'no Cognito clientId found',
        Storage: new CookieStorage({domain: 'localhost', secure: false}) // Your client id here
    };

    const authenticationData = {
        Username: email,
        Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(
        authenticationData
    );
    const userPool = new CognitoUserPool(poolData);
    const userData = {
        Username: email,
        Pool: userPool,
        Storage: new CookieStorage({domain: 'localhost', secure: false})
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const accessToken = result.getAccessToken().getJwtToken();
            console.log(accessToken);
            axios.patch('https://l2gvl5jlxi5x5y3uzcqubcozy40yuzeh.lambda-url.eu-central-1.on.aws/User/updateUserByUsername', {
                "username": email,
                "authToken": accessToken.toString()
          },   {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
            return error;
          });
            return accessToken;
        },
        onFailure: function (err) {
            console.log(err.message || JSON.stringify(err));
            return err.message
        },
    });
}

export default function Form() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch('/api/auth/confirmRegister', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get('email'),
                confirmCode: formData.get('confirmCode'),
                password: formData.get('rePassword'),
            }),
        });
        console.log(response);
        await authenticateUser(formData.get('email'), formData.get('rePassword'));
        router.redirect('main')
     }
    return (
        <form onSubmit={handleSubmit}>
            <Card className='mx-auto max-w-sm border-0 shadow-none mt-4 sm:mt-12 sm:border sm:shadow-sm md:mt-20 lg:mt-24 xl:mt-28'>
            <CardHeader>
                <CardTitle className='text-xl'>Sign Up</CardTitle>
                <CardDescription>Please enter the confirmation code found in your email to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-4'>
                <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' placeholder='m@example.com' />
                </div>
                <div className='grid gap-2'>
                <Label htmlFor='email'>Confirmation Code</Label>
                <Input id='confirmCode' name='confirmCode' placeholder='12345' />
                </div>
                <div className='grid gap-2'>
                <Label htmlFor='password'>Reenter Password</Label>
                <Input id='rePassword' name='rePassword' type='rePassword' />
                </div>
                <Button type="submit">Create an account</Button>
                </div>
            </CardContent>
            </Card>
        </form>
    )

}