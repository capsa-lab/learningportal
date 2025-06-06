import localFont from 'next/font/local';
import './globals.css';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

export const metadata = {
  title: 'Training Hub',
  description: 'CL Training Hub',
  icon: '/favicon.ico', // /public path
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      options={{
        cookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost:3000',
        path: '/',
        clockSkewInSeconds: 10, // Allow up to 10 seconds of clock skew
      }}
      appearance={{
        elements: {
          footer: 'hidden',
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
