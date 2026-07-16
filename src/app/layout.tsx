import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import './theme.css';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

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

// Runs before any paint. Reads the saved preference (or falls back to the
// OS-level light/dark hint) and stamps data-theme on <html> synchronously,
// so the very first frame already matches the user's theme — no flash.
const noFlashScript = `(function(){try{var t=localStorage.getItem("qa-news-theme");if(!t){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Must run before hydration; suppressHydrationWarning on <html>
            above tolerates the data-theme attribute this script adds. */}
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
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
