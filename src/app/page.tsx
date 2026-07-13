import { getDailyBrief, getLatestNews } from '@/lib/data';
import { formatDayFull } from '@/lib/format';
import StatusLine from '@/components/StatusLine';
import SectionEyebrow from '@/components/SectionEyebrow';
import Pipeline from '@/components/Pipeline';
import PipelineEntry from '@/components/PipelineEntry';

export default async function HomePage() {
  const [brief, latest] = await Promise.all([getDailyBrief(), getLatestNews()]);

  return (
    <>
      <section className="pt-10">
        <SectionEyebrow>Daily Brief</SectionEyebrow>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-paper sm:text-3xl">
          {formatDayFull(brief.date)}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusLine
            sourcesScanned={brief.sourcesScanned}
            storiesSelected={brief.storiesSelected}
            updatedAt={brief.updatedAt}
          />
          <span className="rounded border border-signal-pin/40 bg-signal-pin/10 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-signal-pin">
            Sample data
          </span>
        </div>

        <p className="mt-5 max-w-[62ch] font-serif text-lg leading-relaxed text-paper-muted">
          {brief.lede}
        </p>

        <Pipeline>
          {brief.items.map((article) => (
            <PipelineEntry key={article.id} article={article} />
          ))}
        </Pipeline>
      </section>

      <section className="mt-4 border-t border-ink-600 pt-10">
        <SectionEyebrow>Latest News</SectionEyebrow>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-paper">Rolling feed</h2>

        <Pipeline>
          {latest.map((article) => (
            <PipelineEntry key={article.id} article={article} />
          ))}
        </Pipeline>
      </section>
    </>
  );
}
