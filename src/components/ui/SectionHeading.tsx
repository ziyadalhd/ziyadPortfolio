export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="eyebrow text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
