import type { Metadata } from 'next';
import './globals.css';
import { NutriGoProvider } from '@/context/NutriGoContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import DemoBar from '@/components/DemoBar';

export const metadata: Metadata = {
  title: 'NutriGo — Small choices. Better health.',
  description: 'Fresh, healthy and convenient food portions (Sprouts, Fruits, Vegetables) made for your everyday routine with 7-day trials and monthly subscriptions.',
  icons: {
    icon: '/nutrigo-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1C241D] antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <NutriGoProvider>
          <DemoBar />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </NutriGoProvider>
      </body>
    </html>
  );
}
