"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/services/session";
import { createPlan } from "@/services/plans";
import { useI18n } from "@/i18n/I18nProvider";
import { Dictionary } from "@/i18n/dictionaries";

const DESCRIPTION_LIMIT = 600;

type FormValues = {
  image: string;
  name: string;
  address: string;
  price: string;
  duration: string;
  description: string;
  recommendations: string;
};

type Field = keyof FormValues;
type FormErrors = Partial<Record<Field, string>>;

const initialValues: FormValues = {
  image: "",
  name: "",
  address: "",
  price: "",
  duration: "",
  description: "",
  recommendations: "",
};

// Orden de los campos en pantalla, para enfocar el primero que tenga error
const fieldOrder: Field[] = [
  "image",
  "name",
  "address",
  "price",
  "duration",
  "description",
  "recommendations",
];

function isValidUrl(value: string) {
  return /^https?:\/\/\S+$/i.test(value);
}

function validate(values: FormValues, t: Dictionary): FormErrors {
  const errors: FormErrors = {};
  const messages = t.createPlan.errors;

  const name = values.name.trim();
  if (name.length < 2 || name.length > 50) {
    errors.name = messages.name;
  }

  if (!values.address.trim()) {
    errors.address = messages.address;
  }

  const price = Number(values.price);
  if (values.price.trim() === "" || Number.isNaN(price) || price <= 0) {
    errors.price = messages.price;
  }

  const duration = Number(values.duration);
  if (values.duration.trim() === "" || !Number.isInteger(duration) || duration <= 0) {
    errors.duration = messages.duration;
  }

  if (!values.description.trim()) {
    errors.description = messages.descriptionRequired;
  } else if (values.description.length >= DESCRIPTION_LIMIT) {
    errors.description = messages.descriptionLength;
  }

  // La imagen es opcional, pero si se escribe debe ser un enlace http(s)
  const image = values.image.trim();
  if (image && !isValidUrl(image)) {
    errors.image = messages.image;
  }

  return errors;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-2 text-slate-900 placeholder:text-slate-500 aria-invalid:border-red-600";
const labelClass = "block text-sm font-semibold text-slate-900";
const errorClass = "text-sm text-red-700 mt-1";

export default function CreatePlanPage() {
  const router = useRouter();
  const { t } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<FormValues>(initialValues);
  // Los errores se muestran después del primer intento de publicar
  // y a partir de ahí se recalculan mientras el usuario escribe
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(false);

  const errors = submitted ? validate(values, t) : {};
  const image = values.image.trim();

  // Solo los usuarios con sesión pueden crear planes
  useEffect(() => {
    if (!getSession().id) {
      router.replace("/auth/login");
    }
  }, [router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(false);

    const currentErrors = validate(values, t);
    const firstInvalid = fieldOrder.find((field) => currentErrors[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus();
      return;
    }

    const session = getSession();
    if (!session.id) {
      router.push("/auth/login");
      return;
    }

    const name = values.name.trim();

    setSubmitting(true);
    try {
      await createPlan({
        name,
        description: values.description.trim(),
        estimatedPrice: Number(values.price),
        estimatedTime: Number(values.duration),
        // El back no acepta recomendaciones vacías, pero en el formulario son opcionales
        recomendations:
          values.recommendations.trim() || t.createPlan.defaultRecommendations,
        address: values.address.trim(),
        // Si no se pone foto usamos una imagen genérica
        image: image || `https://picsum.photos/seed/${encodeURIComponent(name)}/1200/700`,
        userId: session.id,
      });
      router.push("/plans");
    } catch (err) {
      setServerError(true);
      setSubmitting(false);
      console.log(err);
    }
  }

  // Props de accesibilidad comunes para cada campo con posible error
  function a11yProps(field: Field, extraDescription?: string) {
    const describedBy = [extraDescription, errors[field] && `${field}-error`]
      .filter(Boolean)
      .join(" ");
    return {
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": describedBy || undefined,
    };
  }

  function fieldError(field: Field) {
    return (
      errors[field] && (
        <p id={`${field}-error`} className={errorClass}>
          {errors[field]}
        </p>
      )
    );
  }

  const requiredMark = (
    <>
      <span aria-hidden="true" className="text-red-600">
        {" "}
        *
      </span>
      <span className="sr-only"> ({t.createPlan.required})</span>
    </>
  );

  return (
    <div className="flex-1 bg-slate-50 px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900">{t.createPlan.title}</h1>
        <p className="text-slate-600 mt-2">{t.createPlan.subtitle}</p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-10 mt-8"
        >
          {/* Foto de portada */}
          <div className="flex flex-wrap justify-between items-baseline gap-2">
            <label htmlFor="image" className={labelClass}>
              {t.createPlan.image}
            </label>
            <span id="image-hint" className="text-xs text-slate-600">
              {t.createPlan.imageHint}
            </span>
          </div>
          <div className="flex flex-col items-center border-2 border-dashed border-slate-300 rounded-2xl p-6 mt-3">
            {image && isValidUrl(image) ? (
              <img
                src={image}
                alt={t.createPlan.imagePreview}
                className="w-full h-48 object-cover rounded-xl"
              />
            ) : (
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </span>
            )}
            <p className="text-sm text-slate-600 mt-3">{t.createPlan.imageText}</p>
            <input
              id="image"
              name="image"
              type="url"
              inputMode="url"
              placeholder="https://..."
              value={values.image}
              onChange={handleChange}
              className={inputClass}
              {...a11yProps("image", "image-hint")}
            />
            <div className="self-start">{fieldError("image")}</div>
          </div>

          {/* Nombre */}
          <div className="mt-6">
            <label htmlFor="name" className={labelClass}>
              {t.createPlan.name}
              {requiredMark}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              aria-required="true"
              placeholder={t.createPlan.namePlaceholder}
              value={values.name}
              onChange={handleChange}
              className={inputClass}
              {...a11yProps("name")}
            />
            {fieldError("name")}
          </div>

          {/* Dirección */}
          <div className="mt-6">
            <label htmlFor="address" className={labelClass}>
              {t.createPlan.address}
              {requiredMark}
            </label>
            <input
              id="address"
              name="address"
              type="text"
              aria-required="true"
              autoComplete="street-address"
              placeholder={t.createPlan.addressPlaceholder}
              value={values.address}
              onChange={handleChange}
              className={inputClass}
              {...a11yProps("address")}
            />
            {fieldError("address")}
          </div>

          {/* Precio y duración */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label htmlFor="price" className={labelClass}>
                {t.createPlan.price}
                {requiredMark}
              </label>
              <input
                id="price"
                name="price"
                type="number"
                inputMode="decimal"
                min="1"
                aria-required="true"
                placeholder={t.createPlan.pricePlaceholder}
                value={values.price}
                onChange={handleChange}
                className={inputClass}
                {...a11yProps("price")}
              />
              {fieldError("price")}
            </div>
            <div>
              <label htmlFor="duration" className={labelClass}>
                {t.createPlan.duration}
                {requiredMark}
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                aria-required="true"
                placeholder={t.createPlan.durationPlaceholder}
                value={values.duration}
                onChange={handleChange}
                className={inputClass}
                {...a11yProps("duration")}
              />
              {fieldError("duration")}
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <div className="flex justify-between items-baseline gap-2">
              <label htmlFor="description" className={labelClass}>
                {t.createPlan.description}
                {requiredMark}
              </label>
              <span
                id="description-count"
                className={`text-xs ${
                  values.description.length >= DESCRIPTION_LIMIT
                    ? "text-red-700 font-semibold"
                    : "text-slate-600"
                }`}
              >
                {values.description.length} / {DESCRIPTION_LIMIT}
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              rows={4}
              aria-required="true"
              placeholder={t.createPlan.descriptionPlaceholder}
              value={values.description}
              onChange={handleChange}
              className={inputClass}
              {...a11yProps("description", "description-count")}
            />
            {fieldError("description")}
          </div>

          {/* Recomendaciones (opcional) */}
          <div className="mt-6">
            <label htmlFor="recommendations" className={labelClass}>
              {t.createPlan.recommendations}
            </label>
            <p id="recommendations-help" className="text-xs text-slate-600 mt-1">
              {t.createPlan.recommendationsHelp}
            </p>
            <input
              id="recommendations"
              name="recommendations"
              type="text"
              placeholder={t.createPlan.recommendationsPlaceholder}
              value={values.recommendations}
              onChange={handleChange}
              className={inputClass}
              {...a11yProps("recommendations", "recommendations-help")}
            />
          </div>

          {serverError && (
            <p id="submit-error" role="alert" className="text-sm text-red-700 mt-6">
              {t.createPlan.errors.submit}
            </p>
          )}

          <div className="flex justify-end gap-4 border-t border-slate-200 pt-6 mt-8">
            <button
              type="button"
              onClick={() => router.push("/plans")}
              className="bg-slate-200 text-slate-800 font-semibold rounded-xl px-8 py-3"
            >
              {t.createPlan.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white font-semibold rounded-xl px-8 py-3 disabled:opacity-60"
            >
              {submitting ? t.createPlan.submitting : t.createPlan.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
