import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#667eea",
};

export const metadata: Metadata = {
  title: "LifeOS - Personal Digital Life Dashboard",
  description: "A modern, calm, and intelligent personal dashboard for college students. Unify tasks, habits, goals, and mood tracking in one beautiful system.",
  keywords: ["productivity", "dashboard", "tasks", "habits", "mood tracking", "life management"],
  authors: [{ name: "Pruthivi" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LifeOS",
  },
  openGraph: {
    title: "LifeOS - Personal Digital Life Dashboard",
    description: "Organize your life with calm and clarity",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
