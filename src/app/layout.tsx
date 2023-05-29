import { ClerkProvider } from '@clerk/nextjs';
import { type Metadata } from 'next';
import AppLayout from './appLayout';
import "~/styles/globals.css";
import { type PropsWithChildren } from 'react';

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
          <AppLayout>{children}</AppLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}