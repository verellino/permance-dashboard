import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Permance',
  description: 'Permance is a platform for managing and analyzing video content.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
