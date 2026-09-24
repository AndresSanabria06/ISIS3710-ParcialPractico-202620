"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth";
import { saveSession } from "@/services/session";
import { useI18n } from "@/i18n/I18nProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);

    try {
      const id = await register(username, email, name, password);
      saveSession(id, username);
      router.push("/plans");
    } catch (err) {
      setError(true);
      console.log(err);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <h1 className="text-5xl font-bold text-slate-900 mt-6">{t.register.title}</h1>
      <p className="text-lg text-slate-600 mt-2">{t.register.subtitle}</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 mt-10 w-full max-w-md"
      >
        <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
          {t.register.username}
        </label>
        <input
          id="username"
          type="text"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1"
        />

        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mt-4">
          {t.register.name}
        </label>
        <input
          id="name"
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1"
        />

        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mt-4">
          {t.register.email}
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1"
        />

        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mt-4">
          {t.register.password}
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1"
        />

        {error && (
          <p role="alert" className="text-sm text-red-700 mt-4">
            {t.register.error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white font-semibold rounded-xl py-4 mt-8"
        >
          {t.register.submit}
        </button>
      </form>

      <p className="text-sm text-slate-600 mt-8">{t.register.free}</p>
    </div>
  );
}
