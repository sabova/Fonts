"use client";

import { Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { CartProvider } from '../context/CartContext';
import CartIcon from '../components/CartIcon';
import { usePathname } from 'next/navigation';
import Script from "next/script";
import Head from 'next/head';

const poppins = Poppins({ subsets: ['latin'], weight: '500' });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <>
      <Head>
        <title>Fonts</title>
        <meta name="description" content="Personal font collection site as well as search by image tool" />
      </Head>
      <html lang="en">
        <Script
          src="https://analytics.sabrinagoom.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
          data-domain="fonts.sabrinagoom.com"
          strategy="afterInteractive"
        />
        <Script
          id="plausible-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible = window.plausible || function() { 
                (window.plausible.q = window.plausible.q || []).push(arguments) 
              }
            `,
          }}
        />
        <body className={`${poppins.className} bg-[#f9fafb] text-zinc-950 h-screen overflow-hidden`}>
          <CartProvider>
            <div className="h-full flex flex-col p-6">
              <header className="mb-8 flex justify-between items-center">
                <div>
                  <div className='flex'>
                    <Link href="/">
                      <img width={180} src="/logo.png" />
                    </Link>
                  </div>
                  <nav>
                    <Link href="/" className={`mr-4 transition ${pathname === '/' ? 'text-[#70b244]' : 'text-gray-500 hover:text-[#63a239]'}`}>Home</Link>
                    <Link href="/search" className={`transition ${pathname === '/search' ? 'text-[#70b244]' : 'hover:text-[#70b244] text-gray-500'}`}>Search by Image</Link>
                  </nav>
                </div>
                <CartIcon />
              </header>
              <main className="flex-1 bg-white p-8 rounded-3xl border border-zinc-200 overflow-y-auto">
                {children}
              </main>
              <div className="pt-6 text-center text-sm text-gray-500">
                © 2025 <a className="font-semibold text-[#70b244] hover:text-[#63a239] transition" href="https://sabrinagoom.com">Sabrina Goom</a>, made with 💚
              </div>
            </div>
          </CartProvider>
        </body>
      </html>
    </>
  );
}
