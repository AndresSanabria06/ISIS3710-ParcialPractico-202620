"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const UserMenu = dynamic(() => import("./UserMenu"), { ssr: false });

export default function Header() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 bg-white border-b border-slate-200 px-6 md:px-24 py-4">
      <nav aria-label={t.header.mainNav} className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold text-slate-900">{t.header.brand}</span>
        </Link>

        <Link
          href="/plans"
          aria-current={pathname === "/plans" ? "page" : undefined}
          className="text-lg font-semibold text-blue-700"
        >
          {t.header.explore}
        </Link>
      </nav>

      <div className="flex items-center gap-6">
        {/* key={pathname} hace que el menú se vuelva a cargar al cambiar de página,
            así se entera si el usuario acaba de iniciar sesión */}
        <UserMenu key={pathname} />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
