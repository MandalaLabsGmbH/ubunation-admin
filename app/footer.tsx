import Link from 'next/link';
import { inter } from './fonts'; // Assuming you have fonts set up like this

export default function Footer() {

  const legalLinks = [
    { href: '/imprint', label: 'Imprint' },
    { href: '/terms_of_service', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy' },
  ];

  return (
    <footer className={`${inter.className} mt-16 border-t`}>
      <div className="container mx-auto px-6 py-8">
        {/* Top row with navigation links */}
        <div className="flex flex-col items-center justify-center gap-y-4 md:flex-row">
          {/* Legal navigation links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-foreground md:justify-end">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row with copyright */}
        <div className="mt-8 text-center text-sm text-foreground">
          <p>© UBUNΛTION 2025</p>
        </div>
      </div>
    </footer>
  );
}