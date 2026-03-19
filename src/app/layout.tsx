import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/components/web/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const interSans = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-portfolio-tau-six-33xhna7rpv.vercel.app"),

  title: {
    default: "Kishor's Code | Kishor Kumar Ghosh",
    template: "%s | Kishor's Code",
  },

  description:
    "Kishor Kumar Ghosh Portfolio - Full Stack Developer, React, Next.js, Node.js, SEO friendly portfolio",

  keywords: [
    "Kishor Kumar Ghosh",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Bangladesh Developer",
    "Web Developer Portfolio",
  ],

  openGraph: {
    title: "Kishor's Code",
    description: "Full Stack Developer Portfolio",
    url: "https://my-portfolio-tau-six-33xhna7rpv.vercel.app",
    siteName: "Kishor's Code",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kishor's Code",
    description: "Full Stack Developer Portfolio",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${interSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <ConvexClientProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
