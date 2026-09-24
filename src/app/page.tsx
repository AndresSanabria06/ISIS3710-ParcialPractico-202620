import { getDictionary } from "@/i18n/server";

export default async function Home() {
  const t = await getDictionary();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <span className="bg-blue-100 text-blue-700 text-xs font-bold rounded-full px-4 py-1">
        <span
          aria-hidden="true"
          className="w-2 h-2 bg-orange-400 rounded-full inline-block mr-1"
        ></span>
        {t.home.badge}
      </span>

      <h1 className="text-6xl font-bold text-slate-900 mt-8">{t.home.title}</h1>

      <p className="text-lg text-slate-600 max-w-md mt-2">{t.home.subtitle}</p>

      <form
        action="/plans"
        role="search"
        className="flex items-center bg-white rounded-full shadow-lg p-2 mt-10 w-full max-w-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
          className="w-5 h-5 ml-3 text-blue-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <label htmlFor="search" className="sr-only">
          {t.home.searchLabel}
        </label>
        <input
          id="search"
          type="search"
          name="search"
          placeholder={t.home.searchPlaceholder}
          className="flex-1 min-w-0 px-3 text-slate-900 placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold rounded-full px-6 py-2"
        >
          {t.home.explore}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-10">
        <span aria-hidden="true" className="text-green-700">
          ✓
        </span>{" "}
        {t.home.noStrings}
      </p>
    </div>
  );
}
