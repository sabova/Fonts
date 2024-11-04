"use client";

import RootLayout from './layout';
import { useCart } from '../context/CartContext';

export default function Home() {
  return (
    <RootLayout>
      <div className="space-y-6">
        <FontCard fontName="CalSans (Semibold)" fontFamily="CalSans" />
        <FontCard fontName="Inter (Medium)" fontFamily="Inter" />
        <FontCard fontName="Poppins (Medium)" fontFamily="Poppins" />
      </div>
    </RootLayout>
  );
}

function FontCard({ fontName, fontFamily }) {
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some(item => item.fontName === fontName);

  return (
    <div className="w-full p-6 rounded-3xl border border-zinc-200 bg-zinc-50 duration-300">
      <div className="mb-4 p-4 bg-zinc-100 rounded-3xl text-lg text-zinc-900" style={{ fontFamily }}>
        The quick brown fox jumps over the lazy dog
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xl" style={{ fontFamily }}>{fontName}</p>
        <div className="flex space-x-2">
          <button
            className={`flex items-center px-4 py-2 text-sm ${isInCart ? 'in-cart' : 'not-in-cart'} rounded-3xl transition-colors`}
            style={{ fontFamily }}
            onClick={() => !isInCart && addToCart({ fontName, fontFamily })}
          >
            <span className="flex items-center">
              {isInCart ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='w-6 mr-2'>
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                  </svg>
                  Added to Collection
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='w-6 mr-2'>
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                  </svg>
                  Add to Collection
                </>
              )}
            </span>
          </button>
        </div>
      </div>
      <style jsx>{`
        .in-cart {
          background-color: #70b250;
          color: white;
        }
        .not-in-cart {
          background-color: #e5e7eb;
          color: black;
        }
      `}</style>
    </div>
  );
}  