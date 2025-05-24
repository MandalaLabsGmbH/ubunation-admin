import type { Metadata } from "next";
import Head from 'next/head';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { getServerSession } from "next-auth";
import { CookiesProvider } from "next-client-cookies/server"
import Footer from "./footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kloppocar: Wer sammelt, gewinnt",
  description: "Digital sammeln, real erleben!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession();
  return (
    <html lang="en">
      <Head>
        <meta name="viewport"  content="width=device-width, initial-scale=1.0"  />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-10`}
      >
        {/* {!!session &&
          <Logout />
        } */}
        
        <CookiesProvider>
        {children}
        </CookiesProvider>
        <footer>
        <Footer />
      </footer>
      </body>
    </html>
  );
}
