import { ClerkProvider } from '@clerk/nextjs';
import { type Metadata } from 'next';
import PageLayout from './pageLayout';

export const metadata: Metadata = {
  title: 'Gamma',
  description: '😀',
  icons: '/gamma-ray.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <PageLayout>{children}</PageLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}