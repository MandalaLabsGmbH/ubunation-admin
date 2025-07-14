import type { Metadata } from "next";
import Head from 'next/head';
import "./globals.css";
import Footer from "./footer";
import Header from "./header";
import { ThemeProvider } from "../theme-provider";
import { AuthModalProvider } from "@/app/contexts/AuthModalContext";
import AuthModal from "@/app/components/auth/AuthModal";
import AuthSessionProvider from "./session-provider";
import { CartProvider } from "@/app/contexts/CartContext";
import CartModal from "@/app/components/cart/CartModal";
import { PaymentProvider } from "@/app/contexts/PaymentContext"; // Import PaymentProvider
import PaymentModal from "@/app/components/payment/PaymentModal"; // Import PaymentModal

export const metadata: Metadata = {
  title: "Ubunation",
  description: "Digital sammeln, real erleben!",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
            <body>
        <AuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthModalProvider>
              <CartProvider>
                <PaymentProvider> {/* Wrap with PaymentProvider */}
                  <div className="flex flex-col min-h-screen bg-background text-foreground">
                    <Header />
                    <main className="flex-grow container mx-auto p-6">
                        {children}
                    </main>
                    <Footer />
                    <AuthModal />
                    <CartModal />
                    <PaymentModal /> {/* Add the PaymentModal here */}
                  </div>
                </PaymentProvider>
              </CartProvider>
            </AuthModalProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
