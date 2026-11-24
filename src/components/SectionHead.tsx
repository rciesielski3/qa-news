interface SectionHeadProps {
  /** Two-digit section number, e.g. "01". */
  no: string;
  eyebrow: string;
  title: string;
  sub?: string;
  titleId?: string;
}

/** Numbered section header with an accent underline (matches the section nav numbering). */
export default function SectionHead({ no, eyebrow, title, sub, titleId }: SectionHeadProps) {
  return (
    <div className="sec-head">
      <span className="sec-no tnum" aria-hidden="true">
        {no}
      </span>
      <div className="eyebrow">{eyebrow}</div>
      <h2 id={titleId}>{title}</h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  );
}
