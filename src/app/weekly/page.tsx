import { getWeeklyHighlights } from '@/lib/data';
import { formatDay } from '@/lib/format';
import SectionEyebrow from '@/components/SectionEyebrow';
import Pipeline from '@/components/Pipeline';
import PipelineEntry from '@/components/PipelineEntry';

export const metadata = {
  title: 'Weekly Highlights — QA News',
};

export default async function WeeklyPage() {
  const weeks = await getWeeklyHighlights();

  return (
    <section className="pt-10">
      <SectionEyebrow>Weekly Highlights</SectionEyebrow>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-paper sm:text-3xl">
        What mattered, week by week
      </h1>

      {weeks.map((week, index) => (
        <div key={week.weekOf} className={index > 0 ? 'mt-14 border-t border-ink-600 pt-10' : ''}>
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
            Week of {formatDay(week.weekOf)}
          </p>
          <p className="mt-3 max-w-[62ch] font-serif text-lg leading-relaxed text-paper-muted">
            {week.summary}
          </p>

          <Pipeline>
            {week.items.map((article) => (
              <PipelineEntry key={article.id} article={article} />
            ))}
          </Pipeline>
        </div>
      ))}
    </section>
  );
}
