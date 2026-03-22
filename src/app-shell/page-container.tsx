import type { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
  return <main className="space-y-4 p-4 lg:p-6">{children}</main>;
}
