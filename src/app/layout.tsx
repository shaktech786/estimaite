import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#111827',
};

export const metadata: Metadata = {
  title: "EstimAIte - AI-Enhanced Planning Poker",
  description: "Modern planning poker with AI-powered story analysis and estimation suggestions for agile teams.",
  keywords: ["planning poker", "agile", "estimation", "AI", "scrum", "story points"],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ],
  },
  openGraph: {
    title: "EstimAIte - AI-Enhanced Planning Poker",
    description: "Modern planning poker with AI-powered story analysis and estimation suggestions for agile teams.",
    images: ['/logo-transparent.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "EstimAIte - AI-Enhanced Planning Poker",
    description: "Modern planning poker with AI-powered story analysis and estimation suggestions for agile teams.",
    images: ['/logo-transparent.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased h-full bg-gray-900 text-white`}
      >
        <main role="main" className="min-h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
