'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Blockchain', href: '/blockchain' },
  { name: 'App Content', href: '/app-content' },
  { name: 'Statistics', href: '/statistics' },
  { name: 'Users', href: '/users' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 border-r border-sidebar-border">
      <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`block py-2 px-4 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}