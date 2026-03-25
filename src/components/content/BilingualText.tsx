"use client";

import { useLang } from "@/lib/i18n";

interface BilingualTextProps {
  ja: string;
  en: string;
  className?: string;
}

export function BilingualText({ ja, en, className }: BilingualTextProps) {
  const { lang } = useLang();
  const text = lang === "ja" ? ja : en;

  return (
    <>
      {text.split("\n\n").map((paragraph, i) => (
        <p key={i} className={className}>
          {paragraph}
        </p>
      ))}
    </>
  );
}
