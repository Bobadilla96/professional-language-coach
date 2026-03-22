import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.12),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-5xl">{children}</div>
    </main>
  );
}
