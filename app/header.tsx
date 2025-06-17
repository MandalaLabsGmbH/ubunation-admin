'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { inter } from './fonts';
import LogoutButton from './logout-button';
import { ThemeToggleButton } from './theme-toggle-button';
import { useAuthModal } from '@/app/contexts/AuthModalContext';

export default function Header() {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();

  return (
    <header className={`${inter.className} w-full py-4`}>
      <nav className="container mx-auto flex justify-between items-center">
        {/* ... your logo code ... */}
        <Link href="/">
          <div className="relative h-10 w-24">
            <div className="block dark:hidden">
              <Image src="/images/ubuLogoBlack.png" alt="UBU Logo" fill style={{ objectFit: 'contain' }} priority/>
            </div>
            <div className="hidden dark:block">
              <Image src="/images/ubuLogoWhite.png" alt="UBU Logo" fill style={{ objectFit: 'contain' }} priority/>
            </div>
          </div>
        </Link>

        <div className="flex items-center space-x-4 text-sm">
          {session ? (
            <>
              {/* You could add a dashboard link here if needed */}
              <LogoutButton />
            </>
          ) : (
            // Change Link to a button that opens the modal
            <button onClick={() => openModal('/')} className="font-semibold text-foreground/80 hover:text-foreground transition-colors">
              Login
            </button>
          )}

          <ThemeToggleButton />
        </div>
      </nav>
    </header>
  );
}
