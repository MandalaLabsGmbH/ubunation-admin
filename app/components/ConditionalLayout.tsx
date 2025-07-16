'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import Header from '@/app/header';
import Footer from '@/app/footer';

export default function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    // Define the paths where the sidebar should be hidden
    const noSidebarPaths = ['/login', '/forgot'];

    // Check if the current path is one of the no-sidebar paths
    const showSidebar = !noSidebarPaths.some(path => pathname.startsWith(path));

    if (showSidebar) {
        // If it's a regular admin page, render with the sidebar, header, and footer
        return (
            <div className="flex min-h-screen bg-background text-foreground">
                <AdminSidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-grow container mx-auto p-6">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }

    // Otherwise, render a simple layout for login/forgot password pages
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <main className="flex-grow flex items-center justify-center p-6">
                {children}
            </main>
        </div>
    );
}