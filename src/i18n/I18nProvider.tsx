"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { Dictionary, dictionaries, Locale, LOCALE_COOKIE } from "./dictionaries";

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();

  function setLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <I18nContext value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </I18nContext>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  }
  return context;
}
