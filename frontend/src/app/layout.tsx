import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Rentify Drive - Redefine Your Journey",
  description:
    "Experience the future of car rental with AI-powered matching, luxury vehicles, and seamless booking.",
  icons: {
    icon: "/logo.png",
  },
  authors: [{ name: "Rentify Drive" }],
  openGraph: {
    title: "Rentify Drive - Redefine Your Journey",
    description:
      "Experience the future of car rental with AI-powered matching, luxury vehicles, and seamless booking.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Rentify Drive Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo.png"],
  },
};

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <GoogleOAuthProvider clientId={CLIENT_ID!}>
          {children}
        </GoogleOAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
