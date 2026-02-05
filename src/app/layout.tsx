import React from "react";
import { type Metadata, type Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
// import Header from "./_features/Header";
import { ThemeProvider } from "./_components/theme-providers";

// Фонт тохиргоо
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Metadata (v0-ийн илүү мэргэжлийн тайлбарыг ашиглав)
export const metadata: Metadata = {
  title: "DataViz Studio | Turn Raw Data into Interactive Stories",
  description:
    "A professional, interactive data visualization platform. Upload Excel files, receive AI-powered chart suggestions, and create stunning animated visualizations.",
  keywords: [
    "data visualization",
    "charts",
    "Excel",
    "analytics",
    "interactive",
    "AI",
  ],
};

// Viewport тохиргоо (v0-оос авсан, утасны хөтөч дээрх өнгийг тохируулна)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6c47ff", // Таны товчлуурын нил ягаан өнгөтэй ижил болгов
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          card: "bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800",
          formButtonPrimary:
            "bg-[#6c47ff] hover:bg-[#5a3de0] text-white rounded-lg transition-all",
          formFieldInput:
            "rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent",
          footerActionLink: "text-[#6c47ff] hover:underline",
          userButtonPopoverCard:
            "bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Апп-ын ерөнхий суурь өнгө болон бүтцийг энд зааж өгнө */}
            <div className="relative min-h-screen flex flex-col bg-white dark:bg-[#0f0f12] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
              {/* <Header /> */}
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
