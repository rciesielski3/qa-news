import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import './theme.css';
import './bento.css';
import './content-pages.css';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import Footer from '@/components/Footer';
import PageShell from '@/components/PageShell';
import SkipLink from '@/components/SkipLink';

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
  title: 'QA News — daily curated QA & testing news',
  description:
    'A public feed of the most important QA, test automation, AI and software engineering news, selected daily by the QA News pipeline.',
  openGraph: {
    title: 'QA News — daily curated QA & testing news',
    description:
      'A public feed of the most important QA, test automation, AI and software engineering news, selected daily by the QA News pipeline.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'QA News — daily curated QA & testing news',
    description:
      'A public feed of the most important QA, test automation, AI and software engineering news, selected daily by the QA News pipeline.',
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
      <body>
        <SkipLink />
        <div className="page">
          <Header />
          <StatsBar />
          <main id="top" tabIndex={-1}>
            <PageShell>{children}</PageShell>
          </main>
          <footer className="site-footer">
            <div className="wrap">
              <Footer />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
