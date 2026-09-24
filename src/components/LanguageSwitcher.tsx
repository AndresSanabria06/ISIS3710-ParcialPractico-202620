"use client";

import { useI18n } from "@/i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { locale, t, setLocale } = useI18n();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      aria-label={t.header.switchLanguageLabel}
      className="border border-slate-300 text-slate-700 font-semibold rounded-lg px-3 py-2"
    >
      {t.header.switchLanguage}
    </button>
  );
}
