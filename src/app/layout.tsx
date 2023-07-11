import { type Metadata } from 'next';
import "@/styles/globals.css";
import { type PropsWithChildren } from 'react';
import Nav from './_components/Nav';
import Header from './_components/Header';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider, SignedIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Gamma',
  description: '😀',
  icons: '/gamma-ray.png',
};

export default function RootLayout({
  children,
}: PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedIn>
            <Nav />
            <Header />
          </SignedIn>
          <main className="container mx-auto max-w-7xl py-6 lg:px-8">{children}</main>
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}