import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Salary — Учёт доходов и расходов",
  description: "Персональный трекер финансов с категориями и аналитикой",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-500/20 selection:text-brand-600">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="ambient-glow-emerald" />
          <div className="ambient-glow-blue" />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
