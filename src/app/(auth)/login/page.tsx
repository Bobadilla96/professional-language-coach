"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LanguageSelector } from "@/components/common/language-selector";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useUiText } from "@/hooks/use-ui-text";
import { getDemoCredentials } from "@/lib/auth.client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const nextPath = typeof window === "undefined" ? "/dashboard" : new URLSearchParams(window.location.search).get("next") || "/dashboard";
  const { login, ready, isAuthenticated } = useAuth();
  const { t } = useUiText();
  const [serverError, setServerError] = useState("");
  const supabaseEnabled = isSupabaseConfigured();
  const demoCredentials = getDemoCredentials();

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("validEmailError")),
        password: z.string().min(6, t("passwordMinError"))
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: demoCredentials?.email ?? "",
      password: demoCredentials?.password ?? ""
    }
  });

  useEffect(() => {
    if (!ready || !isAuthenticated) return;
    router.replace(nextPath);
  }, [isAuthenticated, nextPath, ready, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    const result = await login(values.email, values.password);
    if (!result.ok) {
      setServerError(
        result.error === "Invalid email or password." || result.error === "Invalid login credentials"
          ? t("invalidCredentials")
          : result.error
      );
      return;
    }

    router.push(nextPath);
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-600">{t("appName")}</p>
            <h1 className="mt-2 text-3xl font-semibold">{t("welcomeBack")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <ThemeToggle />
          </div>
        </div>

        <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">{t("loginDescription")}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">{t("email")}</span>
            <Input type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">{t("password")}</span>
            <Input type="password" placeholder={t("securePasswordPlaceholder")} {...register("password")} />
            {errors.password ? <span className="text-xs text-rose-600">{errors.password.message}</span> : null}
          </label>

          {serverError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
              {serverError}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting || !ready}>
            {isSubmitting ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      </article>

      <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">{supabaseEnabled ? t("cloudAuthEnabledTitle") : t("demoCredentials")}</h2>
        {demoCredentials ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/70">
            <p>
              <span className="font-semibold">{t("email")}:</span> {demoCredentials.email}
            </p>
            <p>
              <span className="font-semibold">{t("password")}:</span> {demoCredentials.password}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            {t("cloudAuthEnabledDescription")}
          </div>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-300">{t("createOwnAccountHint")}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/register" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500">
            {t("createAccount")}
          </Link>
          <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            {t("backToLanding")}
          </Link>
        </div>
      </aside>
    </section>
  );
}
