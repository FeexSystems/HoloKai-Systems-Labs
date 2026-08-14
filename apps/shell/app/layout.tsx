import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Header, Footer, MetaTags } from '@holokai/branding';
import { GlobalHeader, GlobalFooter, AIChatLauncher } from '@holokai/ui';
import { RuntimeProvider } from '@holokai/runtime';
import { Cinzel, Inter } from 'next/font/google';
import { ClerkProvider, SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import './global.css';

const cinzel = Cinzel({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-sans',
});

const siteUrl = 'https://holokai.io';

export const viewport: Viewport = {
  themeColor: '#c8952a',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'HoloKai · Where Civilizations Remember',
    template: '%s · HoloKai',
  },
  description:
    'Civilization-scale spatial research OS. Query 5,000 years of Pan-African epigraphy, astronomy, and oral tradition through AI synthesis with epistemic confidence scoring.',
  keywords: [
    'African civilizations',
    'AI research',
    'epigraphy',
    'ancient history',
    'epistemic AI',
    'Pan-African history',
    'Oracle research engine',
  ],
  authors: [{ name: 'HoloKai Systems Labs' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'HoloKai',
    title: 'HoloKai · Where Civilizations Remember',
    description:
      'Pan-African epigraphy, astronomy & AI synthesis engine. Multi-agent research with epistemic classification.',
    images: [
      {
        url: '/logos/holokai-logo-3d.jpg',
        width: 1200,
        height: 630,
        alt: 'HoloKai – Where Civilizations Remember',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HoloKai · Where Civilizations Remember',
    description:
      'Pan-African epigraphy, astronomy & AI synthesis engine with multi-agent epistemic classification.',
    images: ['/logos/holokai-logo-3d.jpg'],
    creator: '@holokai_io',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`dark ${cinzel.variable} ${inter.variable}`}
      style={{
        '--font-sans': inter.style.fontFamily,
        '--font-display': cinzel.style.fontFamily,
      } as React.CSSProperties}
    >
      <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'HoloKai',
                url: siteUrl,
                description: 'Civilization-scale AI research OS for Pan-African history, epigraphy, and astronomy.',
                publisher: {
                  '@type': 'Organization',
                  name: 'HoloKai Systems Labs',
                  logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/logos/holokai-logo-horizontal.jpg`
                  }
                }
              })
            }}
          />
        </head>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-brand/30 selection:text-brand-contrast">
        <ClerkProvider>
          <RuntimeProvider>
            {/* Skip-to-main accessibility landmark (§37) */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-contrast focus:font-bold focus:text-sm"
            >
              Skip to main content
            </a>

            <Header logoVariant="auto" showBrand={true} />
            
            <div className="w-full bg-[#05050a] border-b border-[var(--color-border)] py-2 px-6 flex justify-end items-center gap-4">
              <SignedOut>
                <div className="text-sm font-bold text-brand hover:text-brand-light">
                  <SignInButton />
                </div>
                <div className="px-3 py-1 bg-[var(--color-brand)] text-black text-sm font-extrabold rounded-full hover:bg-[var(--color-brand-light)]">
                  <SignUpButton />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <GlobalHeader />
            <div className="flex-1">{children}</div>
            <AIChatLauncher />
            <Footer showCopyright={true} />
          </RuntimeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
