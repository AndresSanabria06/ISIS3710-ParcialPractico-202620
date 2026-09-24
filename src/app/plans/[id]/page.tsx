"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "@/services/session";
import { getPlan, likePlan, Plan } from "@/services/plans";
import { useI18n } from "@/i18n/I18nProvider";

export default function PlanDetailPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();

  // undefined = cargando, null = no existe
  const [plan, setPlan] = useState<Plan | null | undefined>(undefined);
  const [likes, setLikes] = useState(0);
  const [likeError, setLikeError] = useState(false);

  // Cuando carga la página, le pedimos el plan al back
  useEffect(() => {
    getPlan(id).then((data) => {
      setPlan(data);
      if (data) {
        setLikes(data.likes);
      }
    });
  }, [id]);

  async function handleLike() {
    setLikeError(false);

    // El id del usuario se guardó en el localStorage al iniciar sesión
    const session = getSession();

    if (!session.id) {
      router.push("/auth/login");
      return;
    }

    try {
      await likePlan(id, session.id);
      setLikes(likes + 1);
    } catch (err) {
      setLikeError(true);
      console.log(err);
    }
  }

  if (plan === undefined) {
    return (
      <p role="status" className="flex-1 bg-slate-50 px-6 md:px-20 py-6 text-slate-600">
        {t.planDetail.loading}
      </p>
    );
  }

  if (plan === null) {
    return (
      <p role="status" className="flex-1 bg-slate-50 px-6 md:px-20 py-6 text-slate-600">
        {t.planDetail.notFound}
      </p>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 px-6 md:px-20 py-6">
      {/* Barra de arriba */}
      <div className="flex justify-between items-center">
        <Link href="/plans" className="text-slate-700">
          {t.planDetail.back}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Columna izquierda */}
        <div className="flex-1">
          {/* Imagen */}
          <div className="relative">
            <img
              src={plan.image}
              alt={plan.name}
              className="w-full h-96 object-cover rounded-2xl"
            />
            <p className="absolute bottom-4 left-4 bg-white text-slate-900 font-semibold rounded-full px-4 py-1">
              <span aria-hidden="true">📍 </span>
              <span className="sr-only">{t.planDetail.address} </span>
              {plan.address}
            </p>
          </div>

          {/* Título */}
          <div className="flex flex-wrap gap-4 justify-between items-center bg-white rounded-2xl p-6 mt-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{plan.name}</h1>
              {plan.creator && (
                <p className="flex items-center text-slate-600 mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  {t.planDetail.organizedBy}
                  <span className="font-semibold text-slate-900 ml-1">{plan.creator.name}</span>
                  <span className="text-slate-600 ml-1">@{plan.creator.userName}</span>
                </p>
              )}
            </div>
            <div className="flex items-center bg-orange-100 rounded-full px-6 py-3" aria-live="polite">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
                className="w-6 h-6 mr-2 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <span className="font-semibold text-slate-900">{likes}</span>
              <span className="text-slate-700 text-sm ml-1">{t.planDetail.likes}</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-2xl p-10 mt-8">
            <h2 className="text-2xl text-slate-900">{t.planDetail.description}</h2>
            <p className="text-lg text-slate-600 mt-4">{plan.description}</p>
          </div>

          {/* Recomendaciones */}
          <div className="bg-white rounded-2xl p-10 mt-8">
            <h2 className="text-2xl text-slate-900">{t.planDetail.recommendations}</h2>
            <p className="text-lg text-slate-600 mt-4">{plan.recomendations}</p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="w-full lg:w-96">
          {/* Precio e inscripción */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center gap-2">
              <p className="text-4xl font-bold text-slate-900">
                ${plan.estimatedPrice.toLocaleString(t.meta.numberLocale)}
              </p>
              <p className="text-sm text-slate-600">{t.planDetail.perPerson}</p>
            </div>

            <div className="border-t border-b border-slate-200 py-4 mt-6">
              <div className="flex justify-between">
                <p className="text-slate-600">{t.planDetail.duration}</p>
                <p className="font-semibold text-slate-900">
                  {plan.estimatedTime} {t.planDetail.minutes}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLike}
              className="w-full bg-blue-700 text-white font-semibold rounded-xl py-4 mt-6"
            >
              {t.planDetail.like}
            </button>
            {likeError && (
              <p role="alert" className="text-sm text-red-700 mt-2">
                {t.planDetail.likeError}
              </p>
            )}
            <button type="button" className="w-full bg-blue-50 text-slate-900 rounded-xl py-3 mt-3">
              {t.planDetail.askHost}
            </button>

            <p className="text-sm text-slate-600 text-center mt-6">
              {t.planDetail.cancellation}
            </p>
          </div>

          {/* Experiencia segura */}
          <div className="bg-blue-50 rounded-2xl p-6 mt-8">
            <p className="font-semibold text-slate-900">
              <span aria-hidden="true">🛡️ </span>
              {t.planDetail.safeTitle}
            </p>
            <p className="text-sm text-slate-600 mt-2">{t.planDetail.safeText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
