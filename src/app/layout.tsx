import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/app-layout";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MANNS | Gestão Financeira Universitária",
  description: "Controle financeiro e acadêmico para estudantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className="bg-[#0B0914] text-white min-h-screen flex flex-col md:flex-row antialiased transition-colors duration-200"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
