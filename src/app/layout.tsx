import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/app-layout";

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
        className="bg-[#0B0914] text-white min-h-screen flex antialiased"
        suppressHydrationWarning
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}