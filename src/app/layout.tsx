import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Wise Law | 지혜로운 법률사무소",
  description: "AI 기술력을 선도하는 프리미엄 법률 서비스, 더와이즈",
  openGraph: {
    title: "The Wise Law | 지혜로운 법률사무소",
    description: "AI 기술력을 선도하는 프리미엄 법률 서비스, 더와이즈",
    url: "https://thewiselaw.co.kr",
    siteName: "The Wise Law",
    images: [
      {
        url: "https://thewiselaw.co.kr/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Wise Law preview image",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased dark">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
