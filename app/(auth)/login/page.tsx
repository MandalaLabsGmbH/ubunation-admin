'use client'

import { useState, Suspense, JSX } from 'react';
import LoginForm from './login-form';
import RegisterForm from './register-form';
import ConfirmRegisterForm from './confirm-register-form';

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
    let headerText: string | JSX.Element;

    switch (view) {
        case 'register':
            // Pass the updated callback to the register form
            formComponent = <RegisterForm onRegisterSuccess={onRegisterSuccess} />;
            headerText = (
                <>
                   Already have an account?{' '}
                    <button onClick={() => switchView('login')} className='underline'>
                        Login
                    </button>
                </>
            );
            break;
        case 'confirm_register':
            // Pass email and password to the confirm form
            formComponent = <ConfirmRegisterForm email={email} password={password} />;
            headerText = `We've sent a confirmation code to ${email}.`;
            break;
        default: // 'login'
            formComponent = <LoginForm />;
            headerText = (
                <>
                    Don&apos;t have an account?{' '}
                    <button onClick={() => switchView('register')} className='underline'>
                        Sign up
                    </button>
                </>
            );
            break;
    }
    // The rest of your JSX remains the same...
    return (
        <div className="page">
            <section className="registerVid pt-10 flex justify-center">
                <div className="flex justify-center bg-black items-center h-80 w-60 overflow-hidden translate-z-1 rounded-4xl border border-solid p-10px">
                    <Suspense fallback={<p>Loading video...</p>}>
                        <video className="h-80" autoPlay muted loop preload="none" aria-label="Video player">
                            <source src={'https://deins.s3.eu-central-1.amazonaws.com/video/card/spinCard.mp4'} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Suspense>
                </div>
            </section>
            <section className="flex justify-center items-center">
                <p className="pt-6 text-l font">
                    Sichere dir die Chance auf ein Treffen mit Jürgen Klopp –
                </p>
            </section>
            <section className="flex justify-center items-center">
                <p className="text-l font">
                    Digital sammeln, real erleben!
                </p>
            </section>
            <div className='mt-4 text-center text-sm'>
                {headerText}
            </div>
            {formComponent}
        </div>
    );
}