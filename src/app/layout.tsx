import type { Metadata } from "next";
import { Inter, Teko } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const teko = Teko({ 
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: '--font-street'
});

export const metadata: Metadata = {
  title: "WALK THIS WAY - Local Discovery Platform",
  description: "Discover the best local spots in cities around the world",
};

// Client component wrapper
import dynamic from 'next/dynamic';
const ClientLayout = dynamic(() => import('@/components/layout/ClientLayout'), {
  ssr: true
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} ${teko.variable} min-h-screen bg-[#111827] text-gray-200`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
