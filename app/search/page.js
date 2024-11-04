"use client";

import RootLayout from '../layout';
import { useState, useRef } from "react";
import { Rnd } from "react-rnd";

export default function SearchPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [freeOnly, setFreeOnly] = useState(true);
  const [selection, setSelection] = useState({ x: 50, y: 50, width: 100, height: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImageUrl("");
    setIsModalOpen(true);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      let imageBase64 = null;
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imageBase64 = reader.result.split(",")[1];
          performSearch({ imageBase64 });
        };
        reader.readAsDataURL(imageFile);
      } else if (imageUrl) {
        performSearch({ imageUrl });
      } else {
        setError("Please upload an image");
        setLoading(false);
      }
    } catch (err) {
      setError("Error converting image file");
      setLoading(false);
    }
  };

  const performSearch = async ({ imageUrl, imageBase64 }) => {
    try {
      const response = await fetch("/api/searchFont", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          imageBase64,
          limit: 5,
          freeOnly: freeOnly ? 1 : 0,
          selection,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || "An error occurred during search");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    closeModal();
  };

  return (
    <RootLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Search Fonts by Image</h1>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={handleFileButtonClick}
            className="px-4 py-2 rounded-3xl border border-zinc-300 bg-[#70b244] text-white hover:bg-[#63a239] focus:outline-none focus:ring-2 focus:ring-[#70b244] focus:ring-opacity-100"
          >
            Upload Image
          </button>
        </div>

        {(imageUrl || imageFile) && (
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-700">Selected Image:</p>
            <div className="relative mt-2 w-full h-32 border border-zinc-200 rounded-3xl overflow-hidden">
              <img
                src={imageUrl || URL.createObjectURL(imageFile)}
                alt="Selected Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={openModal}
                className="absolute inset-0 bg-black bg-opacity-40 text-white text-xs font-semibold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                Edit Selection
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center mt-6">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
            className="mr-2 rounded-3xl text-[#63a239] focus:ring-[#63a239]"
          />
          <label className="text-sm font-medium text-zinc-700">
            Show only free fonts
          </label>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-3 bg-[#70b244] text-white font-semibold rounded-3xl hover:bg-[#63a239] transition-colors"
        >
          {loading ? "Searching..." : "Search Fonts"}
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold text-center mb-4">Select Text Area</h2>
              <div className="relative">
                {imageUrl || imageFile ? (
                  <img
                    src={imageUrl || URL.createObjectURL(imageFile)}
                    alt="Uploaded or URL-based"
                    className="w-full h-auto max-w-none mx-auto"
                  />
                ) : null}

                <Rnd
                  bounds="parent"
                  size={{ width: selection.width, height: selection.height }}
                  position={{ x: selection.x, y: selection.y }}
                  onDragStop={(e, d) => {
                    setSelection((prev) => ({ ...prev, x: d.x, y: d.y }));
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    setSelection({
                      width: parseInt(ref.style.width, 10),
                      height: parseInt(ref.style.height, 10),
                      x: position.x,
                      y: position.y,
                    });
                  }}
                  className="border-2 border-[#70b244]"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-full py-2 bg-[#70b244] text-white font-semibold rounded-3xl hover:bg-[#63a239] transition-colors"
              >
                Submit Selection
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <div className="mt-8 space-y-4">
          {results.length > 0 && <h2 className="text-xl font-semibold">Results:</h2>}
          {results.map((font, index) => (
            <div key={index} className="p-4 border border-zinc-200 rounded-3xl flex flex-col items-center space-y-2">
              <img src={font.image} alt={font.title} className="w-full h-auto object-cover" />
              <div className="text-center">
                <h3 className="font-bold text-lg">{font.title}</h3>
                <a
                  href={font.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#70b244] hover:underline"
                >
                  View on WhatFontIs
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-8">
        <h1 className="text-sm text-zinc-500">Powered by</h1>
        <a className="mt-2" href="https://www.WhatFontis.com" title="What Font is"><img src="https://www.whatfontis.com/WhatFontis.gif" alt="What Font is" border="0"/></a>
      </div>
    </RootLayout>
  );
}
