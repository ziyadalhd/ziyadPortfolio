import { notFound } from "next/navigation";

import { SpecPage } from "@/components/spec/SpecPage";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { personSchema } from "@/lib/person-schema";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <>
      {/* script-src already allows inline, and CSP does not apply to
          non-executable ld+json. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema(locale, dict.meta.description)),
        }}
      />
      <SpecPage locale={locale} dict={dict} />
    </>
  );
}
