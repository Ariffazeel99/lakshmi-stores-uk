import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { TopAnnouncementBar } from '@/components/navigation/TopAnnouncementBar';
import { Header } from '@/components/navigation/Header';
import { MegaMenu } from '@/components/navigation/MegaMenu';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/navigation/SearchModal';
import { ProductQuickViewModal } from '@/components/product/ProductQuickViewModal';
import { CheckoutModal } from '@/components/cart/CheckoutModal';
import { Footer } from '@/components/home/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Lakshmi Stores UK — Authentic Indian Grocery & Fresh Air Produce',
  description: 'Clone & Modernized e-commerce storefront for Lakshmi Stores UK. Buy air-shipped fresh vegetables from Tamil Nadu & Kerala, Sona Masoori Rice, Toor Dal, MDH Spices, and Pooja items with express UK delivery.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-800 bg-slate-50/50 selection:bg-brand-800 selection:text-gold-400">
        <TopAnnouncementBar />
        <Header />
        <MegaMenu />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <SearchModal />
        <ProductQuickViewModal />
        <CheckoutModal />
      </body>
    </html>
  );
}

