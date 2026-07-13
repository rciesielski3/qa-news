import { portfolioUrl } from '@/lib/site';
import SectionEyebrow from '@/components/SectionEyebrow';

export const metadata = {
  title: 'About — QA News',
};

export default function AboutPage() {
  return (
    <section className="pt-10">
      <SectionEyebrow>About this project</SectionEyebrow>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-paper sm:text-3xl">
        Not another RSS aggregator
      </h1>

      <p className="mt-5 max-w-[62ch] font-serif text-lg leading-relaxed text-paper-muted">
        QA News is a public, read-only consumer of the PAIOS Knowledge Layer. It has no business
        logic of its own and runs no AI — it renders whatever PAIOS has already selected: Daily
        Brief, Latest News, Weekly Highlights, Monthly Recap. The two projects are built to evolve
        independently.
      </p>

      <a
        href={portfolioUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-8 inline-block rounded border border-signal-pass/40 bg-signal-pass/10 px-4 py-2 font-mono text-sm text-signal-pass no-underline hover:bg-signal-pass/20"
      >
        See the full portfolio →
      </a>
    </section>
  );
}
