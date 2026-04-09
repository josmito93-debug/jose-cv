import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "./components/ChatWidget";

export const metadata: Metadata = {
  title: "Universa Agency - High Performance Digital Infrastructure",
  description: "Universa Agency professional workspace. Automated high-performance digital infrastructure and trading intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        {/* Chatbot widget - aparece en todas las páginas */}
        <ChatWidget />
      </body>
    </html>
  );
}
