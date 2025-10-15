import type { Metadata } from "next";
import Head from 'next/head';
import "./globals.css";
import { ThemeProvider } from "../theme-provider";
import { AuthModalProvider } from "@/app/contexts/AuthModalContext";
import AuthModal from "@/app/components/auth/AuthModal";
import AuthSessionProvider from "./session-provider";
import { LanguageProvider } from "@/app/contexts/LanguageContext";
import { CartProvider } from "@/app/contexts/CartContext";
import CartModal from "@/app/components/cart/CartModal";
import { PaymentProvider } from "@/app/contexts/PaymentContext";
import PaymentModal from "@/app/components/payment/PaymentModal";
import ConditionalLayout from "@/app/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "Ubunation Admin",
  description: "Admin toolset for Ubunation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <AuthSessionProvider>
          <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthModalProvider>
              <CartProvider>
                <PaymentProvider>
                  {/* The new component wraps the page content */}
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>

                  {/* Modals remain outside to overlay everything */}
                  <AuthModal />
                  <CartModal />
                  <PaymentModal />
                </PaymentProvider>
              </CartProvider>
            </AuthModalProvider>
          </ThemeProvider>
          </LanguageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}