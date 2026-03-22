import type { PropsWithChildren } from "react";
import { AppShellLayout } from "@/app-shell/app-layout";
import { AuthGuard } from "@/components/common/auth-guard";

export default function PlatformLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <AppShellLayout>{children}</AppShellLayout>
    </AuthGuard>
  );
}
