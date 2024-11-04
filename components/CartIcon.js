"use client";

import { useCart } from '../context/CartContext';
import { useState } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default function CartIcon() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    
    cartItems.forEach(item => {
      const fontName = item.fontName.replace(/\s+\(.*\)/, '').replace(/\s+/g, '').toLowerCase();
      let fontFileExtension = '.ttf';

      if (fontName === 'calsans') {
        fontFileExtension = '.otf';
      } else if (fontName === 'inter') {
        fontFileExtension = '.woff2';
      } else if (fontName === 'poppins') {
        fontFileExtension = '.ttf';
      }

      const fontFilePath = `/fonts/${fontName}${fontFileExtension}`;
      zip.file(`${item.fontName}${fontFileExtension}`, fetch(fontFilePath).then(response => response.blob()));
      zip.file("thanks.txt", fetch("/fonts/thanks.txt").then(response => response.blob()));
    });

    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, "Fonts.zip");
  };

  return (
    <div className="relative">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='w-12 text-[#70b244]'>
          <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
        </svg>
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 bg-[#63a239] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl p-4 border border-zinc-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Collection</h3>
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.fontName} className="flex justify-between items-center">
                <span style={{ fontFamily: item.fontFamily }}>{item.fontName}</span>
                <button onClick={() => removeFromCart(item.fontName)} className="text-xs text-red-500">Remove</button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button onClick={handleDownloadAll} className="w-full bg-[#70b244] hover:bg-[#63a239] transition-colors text-white py-2 rounded-3xl">Download All</button>
            <button onClick={clearCart} className="w-full bg-zinc-200 hover:bg-zinc-300 transition-colors text-zinc-600 py-2 mt-2 rounded-3xl">Clear Collection</button>
          </div>
        </div>
      )}
    </div>
  );
}
