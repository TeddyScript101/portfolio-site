import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://teddyyee-portfolio.vercel.app"),
  title: "Teddy Yee | Portfolio",
  description: "The portfolio website of Teddy Yee, with software projects, experience, and more.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/site-icon.png", type: "image/png", sizes: "512x512" },
      { url: "/site-icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/site-icon.png", sizes: "512x512", type: "image/png" }],
  },
  openGraph: {
    title: "Teddy Yee | Portfolio",
    description: "Full Stack Developer portfolio featuring software projects and technical writing.",
    url: "/",
    siteName: "Teddy Yee Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Teddy Yee portfolio coding preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teddy Yee | Portfolio",
    description: "Full Stack Developer portfolio featuring software projects and technical writing.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
