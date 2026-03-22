import type { Metadata } from "next";
import { LanguageSync } from "@/components/common/language-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech English Coach",
  description: "Learn practical technical English for real software workflows"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <LanguageSync />
        {children}
      </body>
    </html>
  );
}
