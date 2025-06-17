'use client'

import { useState, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/app/contexts/AuthModalContext';
import { X } from 'lucide-react';
import LoginForm from './login-form';
import RegisterForm from './register-form';
import ConfirmRegisterForm from './confirm-register-form';

type AuthView = 'login' | 'register' | 'confirm_register';

export default function AuthModal() {
  const { isOpen, closeModal, redirectUrl } = useAuthModal();
  const router = useRouter();
  
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) {
    return null;
  }
  
  const handleClose = () => {
    setView('login'); // Reset to default view when closing
    closeModal();
  }
  
  const handleSuccess = () => {
    router.push(redirectUrl);
    router.refresh();
    handleClose();
  };

  const onRegisterSuccess = (registeredEmail: string, registeredPassword: string) => {
      setEmail(registeredEmail);
      setPassword(registeredPassword);
      setView('confirm_register');
  };

  let formComponent;
  let switchViewText: JSX.Element;

  switch (view) {
      case 'register':
          formComponent = <RegisterForm onRegisterSuccess={onRegisterSuccess} />;
          switchViewText = ( <> Already have an account?{' '} <button onClick={() => setView('login')} className='underline font-semibold'>Login</button> </>);
          break;
      case 'confirm_register':
          formComponent = <ConfirmRegisterForm email={email} password={password} onSuccess={handleSuccess} />;
          switchViewText = <></>;
          break;
      default:
          formComponent = <LoginForm onSuccess={handleSuccess} />;
          switchViewText = ( <> Don&apos;t have an account?{' '} <button onClick={() => setView('register')} className='underline font-semibold'>Sign up</button> </> );
          break;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="relative bg-background rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="h-6 w-6" />
        </button>
        
        <div className="mt-4">
            {formComponent}
        </div>
        
        <div className='mt-4 text-center text-sm text-muted-foreground'>
            {switchViewText}
        </div>
      </div>
    </div>
  );
}