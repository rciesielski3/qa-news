import type { Metadata } from 'next';

// Self-hosted via @fontsource (npm packages, not a Google Fonts network
// fetch). This keeps the build reproducible on any CI runner, including
// ones without outbound access to fonts.googleapis.com.
import '@fontsource/ibm-plex-serif/500.css';
import '@fontsource/ibm-plex-serif/600.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

import './globals.css';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'QA News — curated by PAIOS',
  description:
    'A public feed of the most important QA, test automation, AI and software engineering news, selected daily by PAIOS.',
  openGraph: {
    title: 'QA News — curated by PAIOS',
    description:
      'A public feed of the most important QA, test automation, AI and software engineering news, selected daily by PAIOS.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'QA News — curated by PAIOS',
    description:
      'A public feed of the most important QA, test automation, AI and software engineering news, selected daily by PAIOS.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Header />
        <StatsBar />
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <footer className="mx-auto w-full max-w-content px-5 py-16 sm:px-8">
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
