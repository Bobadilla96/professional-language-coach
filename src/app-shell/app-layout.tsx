import type { PropsWithChildren } from "react";
import { CourseEnrollmentSync } from "@/components/common/course-enrollment-sync";
import { ProgressSync } from "@/components/common/progress-sync";
import { Header } from "./header";
import { PageContainer } from "./page-container";
import { Sidebar } from "./sidebar";

export function AppShellLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1560px] gap-4 p-4 lg:grid-cols-[260px_1fr]">
      <ProgressSync />
      <CourseEnrollmentSync />
      <Sidebar />
      <div className="space-y-4">
        <Header />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
