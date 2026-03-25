"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "ja" | "en";

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ja");

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "ja" ? "en" : "ja"));
  }, []);

  return (
    <I18nContext.Provider value={{ lang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLang must be used within I18nProvider");
  return ctx;
}
