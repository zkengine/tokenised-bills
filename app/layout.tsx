import '@/assets/css/globals.css';
import AppLayout from '@/components/app-layout';
import { AppProviders } from '@/components/app-providers';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import 'external-svg-loader';
import type { Metadata, Viewport } from 'next';
import { EB_Garamond } from 'next/font/google';

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tokenised Bills',
  description: 'Tokenised Bills',
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${ebGaramond.variable} antialiased`}
        suppressHydrationWarning
      >
        <InitColorSchemeScript attribute='class' />
        <AppProviders>
          <AppLayout>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  );
}

// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
