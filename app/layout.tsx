import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "./components/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.universaagency.com"),
  title: "Universa Agency - High Performance Digital Infrastructure",
  description: "Universa Agency professional workspace. Automated high-performance digital infrastructure and trading intelligence.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  },
  openGraph: {
    images: ['/opengraph-image'],
  },
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
