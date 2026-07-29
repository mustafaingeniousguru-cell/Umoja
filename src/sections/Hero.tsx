"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const banners = [
  { src: "/Umoja Banner Dark background.jpg", alt: "Umoja Treasure Co. Banner" },
  { src: "/Umoja Banner Dark background 2.jpg", alt: "Umoja Treasure Co. Banner 2" },
  { src: "/Umoja Banner Dark background 3.jpg", alt: "Umoja Treasure Co. Banner 3" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#0a1628] pt-20"
    >
      <div className="relative w-full">
        {banners.map((banner, i) => (
          <div
            key={i}
            className={`transition-opacity duration-1000 ${
              i === current ? "relative opacity-100" : "absolute inset-0 opacity-0"
            }`}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              width={1920}
              height={1080}
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-[#c9a84c]" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
