import { getMonthlyRecaps } from '@/lib/data';
import SectionEyebrow from '@/components/SectionEyebrow';
import Pipeline from '@/components/Pipeline';
import PipelineEntry from '@/components/PipelineEntry';

export const metadata = {
  title: 'Monthly Recap — QA News',
};

function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default async function MonthlyPage() {
  const months = await getMonthlyRecaps();

  return (
    <section className="pt-10">
      <SectionEyebrow>Monthly Recap</SectionEyebrow>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-paper sm:text-3xl">
        The bigger picture
      </h1>

      {months.map((month, index) => (
        <div
          key={month.month}
          className={index > 0 ? 'mt-14 border-t border-ink-600 pt-10' : ''}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-paper-faint">
            {formatMonth(month.month)}
          </p>
          <p className="mt-3 max-w-[62ch] font-serif text-lg leading-relaxed text-paper-muted">
            {month.summary}
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {month.themes.map((theme) => (
              <li key={theme.title} className="rounded border border-ink-600 bg-ink-800 p-4">
                <p className="font-serif text-base font-medium text-paper">{theme.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper-muted">
                  {theme.description}
                </p>
              </li>
            ))}
          </ul>

          <Pipeline>
            {month.items.map((article) => (
              <PipelineEntry key={article.id} article={article} />
            ))}
          </Pipeline>
        </div>
      ))}
    </section>
  );
}
