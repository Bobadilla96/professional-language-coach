"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthRole } from "@/domain/models/auth";
import { LanguageSelector } from "@/components/common/language-selector";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useUiText } from "@/hooks/use-ui-text";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
};

export default function RegisterPage() {
  const router = useRouter();
  const nextPath = typeof window === "undefined" ? "/dashboard" : new URLSearchParams(window.location.search).get("next") || "/dashboard";
  const { register: registerAccount, ready, isAuthenticated } = useAuth();
  const { t, roleLabel } = useUiText();
  const [serverError, setServerError] = useState("");
  const [serverNotice, setServerNotice] = useState("");

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("nameMinError")),
        email: z.string().email(t("validEmailError")),
        password: z.string().min(6, t("passwordMinError")),
        role: z.enum(["learner", "mentor", "admin"])
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "learner"
    }
  });

  useEffect(() => {
    if (!ready || !isAuthenticated) return;
    router.replace(nextPath);
  }, [isAuthenticated, nextPath, ready, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");
    setServerNotice("");

    const result = await registerAccount({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role
    });

    if (!result.ok) {
      setServerError(result.error === "This email is already registered." ? t("emailAlreadyRegistered") : result.error);
      return;
    }

    if (result.requiresEmailConfirmation) {
      setServerNotice(t("confirmEmailNotice"));
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
            <h1 className="mt-2 text-3xl font-semibold">{t("createYourAccount")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
            <ThemeToggle />
          </div>
        </div>

        <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">{t("registerDescription")}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">{t("fullName")}</span>
            <Input placeholder={t("fullNamePlaceholder")} {...register("name")} />
            {errors.name ? <span className="text-xs text-rose-600">{errors.name.message}</span> : null}
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">{t("email")}</span>
            <Input type="email" placeholder={t("emailPlaceholder")} {...register("email")} />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-sm">
              <span className="font-medium">{t("password")}</span>
              <Input type="password" placeholder={t("passwordShortPlaceholder")} {...register("password")} />
              {errors.password ? <span className="text-xs text-rose-600">{errors.password.message}</span> : null}
            </label>

            <label className="block space-y-1 text-sm">
              <span className="font-medium">{t("role")}</span>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
                {...register("role")}
              >
                <option value="learner">{roleLabel("learner")}</option>
                <option value="mentor">{roleLabel("mentor")}</option>
                <option value="admin">{roleLabel("admin")}</option>
              </select>
              {errors.role ? <span className="text-xs text-rose-600">{errors.role.message}</span> : null}
            </label>
          </div>

          {serverError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
              {serverError}
            </p>
          ) : null}
          {serverNotice ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              {serverNotice}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting || !ready}>
            {isSubmitting ? t("creatingAccount") : t("createAccount")}
          </Button>
        </form>
      </article>

      <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">{t("whatAfterSignup")}</h2>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">{t("afterSignupEnterDashboard")}</li>
          <li className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">{t("afterSignupLocalProgress")}</li>
          <li className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">{t("afterSignupAskAi")}</li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <Link href="/login" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            {t("alreadyHaveAccount")}
          </Link>
          <Link href="/" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500">
            {t("backToLanding")}
          </Link>
        </div>
      </aside>
    </section>
  );
}
