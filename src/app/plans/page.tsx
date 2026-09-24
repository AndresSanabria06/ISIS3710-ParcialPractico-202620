import Link from "next/link";
import { getPlans } from "@/services/plans";
import { getDictionary } from "@/i18n/server";

export default async function PlansPage({ searchParams }: PageProps<"/plans">) {
  const t = await getDictionary();
  const { search } = await searchParams;
  const query = typeof search === "string" ? search.trim() : "";

  // El buscador de la página de inicio manda ?search=... así que filtramos por nombre
  const allPlans = await getPlans();
  const plans = query
    ? allPlans.filter((plan) =>
        plan.name.toLowerCase().includes(query.toLowerCase())
      )
    : allPlans;

  return (
    <div className="flex-1 bg-slate-50 px-6 md:px-24 py-16">
      <h1 className="text-5xl font-bold text-slate-900">{t.plans.title}</h1>
      {query && (
        <p className="text-lg text-slate-600 mt-2">
          {t.plans.resultsFor} “{query}”
        </p>
      )}

      {plans.length === 0 && (
        <p className="text-lg text-slate-600 mt-12">{t.plans.empty}</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {plans.map((plan) => (
          <li key={plan.id}>
            <Link href={`/plans/${plan.id}`} className="block rounded-xl">
              <img
                src={plan.image}
                alt={plan.name}
                className="w-full h-60 object-cover rounded-xl"
              />
              <h2 className="text-2xl text-slate-900 mt-3">{plan.name}</h2>
              <p className="flex items-center text-sm text-slate-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <span className="sr-only">{t.plans.createdBy}&nbsp;</span>
                {plan.creator.name}
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-slate-600">
                  {t.plans.approximate} $
                  {plan.estimatedPrice.toLocaleString(t.meta.numberLocale)}
                </p>
                <p className="flex items-center text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 mr-1 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  {plan.likes}
                  <span className="sr-only">&nbsp;{t.plans.likes}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
