import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { inter } from './fonts';
import { ThemeToggleButton } from './theme-toggle-button';
import LogoutButton from './logout-button';

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className={`${inter.className} w-full py-4`}>
      <nav className="container mx-auto flex justify-between items-center">
        {/* Left side: App Icon */}
        <Link href="/">
          <div className="relative h-10 w-24">
            <Image
              src="/images/logoSm.png" // Make sure this path is correct
              alt="UBU Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>

        {/* Right side: Navigation Links */}
        <div className="flex items-center space-x-4 text-sm">
          <ThemeToggleButton />
          {session ? (
            // Links for logged-in users
            <>
              <Link href="/main" className="font-semibold hover:text-gray-700 transition-colors">
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            // Link for logged-out users
            <Link href="/login" className="font-semibold hover:text-gray-700 transition-colors">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
