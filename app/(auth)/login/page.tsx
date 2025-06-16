'use client'

import { useState, Suspense, JSX } from 'react';
import LoginForm from './login-form';
import RegisterForm from './register-form';
import ConfirmRegisterForm from './confirm-register-form';
import Image from 'next/image'

export type AuthView = 'login' | 'register' | 'confirm_register';

export default function LoginPage() {
    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>(''); // <-- Add password state

    // Updated to accept password
    const onRegisterSuccess = (registeredEmail: string, registeredPassword: string) => {
        setEmail(registeredEmail);
        setPassword(registeredPassword); // <-- Set password
        setView('confirm_register');
    };

    const switchView = (newView: AuthView) => {
        setView(newView);
    }

    let formComponent;
    let switchViewText: JSX.Element;

    switch (view) {
        case 'register':
            formComponent = <RegisterForm onRegisterSuccess={onRegisterSuccess} />;
            switchViewText = (
                <>
                   Already have an account?{' '}
                    <button onClick={() => switchView('login')} className='underline font-semibold'>
                        Login
                    </button>
                </>
            );
            break;
        case 'confirm_register':
            formComponent = <ConfirmRegisterForm email={email} password={password} />;
            // We don't show a link on the confirmation page
            switchViewText = <></>;
            break;
        default: // 'login'
            formComponent = <LoginForm />;
            switchViewText = (
                <>
                    Don&apos;t have an account?{' '}
                    <button onClick={() => switchView('register')} className='underline font-semibold'>
                        Sign up
                    </button>
                </>
            );
            break;
    }
    // The rest of your JSX remains the same...
    return (
        <div className="page">
            <div className="registerLogo w-1/2 max-w-xs mx-auto relative">
                <Suspense fallback={<p>Loading logo...</p>}>
                        <Image
                            src="/images/ubuLogoBlack.png"
                            alt="Picture of a collectible"
                            width={1500}
                            height={1000}
                        />
                    </Suspense>
            </div>
            <section className="flex justify-center items-center">
                <p className="text-l font-bold">
                    Discover UBUNΛTION:
                </p>
            </section>
             <section className="flex justify-center items-center">
                <p className="text-l font-bold">
                    Uniting Hearts, Changing Lives -
                </p>
            </section>
            <section className="flex justify-center items-center">
                <p className="text-l font-bold">
                    Explore Our Current Charity Campaigns!
                </p>
            </section>
            {formComponent}
            <div className='mt-4 text-center text-sm'>
                {switchViewText}
            </div>
        </div>
    );
}