import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Jback - Cross-Cultural Feedback Intelligence",
  description: "Real-time customer feedback platform powered by Confluent streaming and Google Gemini AI. Understand 100+ languages with cultural intelligence.",
  keywords: ["feedback", "customer feedback", "AI", "multilingual", "cultural intelligence", "Confluent", "Gemini"],
  authors: [{ name: "Jback Team" }],
  openGraph: {
    title: "Jback - Cross-Cultural Feedback Intelligence",
    description: "Real-time customer feedback platform powered by Confluent streaming and Google Gemini AI.",
    url: "https://jback.vercel.app",
    siteName: "Jback",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jback - Cross-Cultural Feedback Intelligence",
    description: "Real-time customer feedback platform powered by Confluent streaming and Google Gemini AI.",
  },
  icons: {
    icon: "/Jback.webp",
    shortcut: "/Jback.webp",
    apple: "/Jback.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
