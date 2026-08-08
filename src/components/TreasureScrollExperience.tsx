"use client";

import TreasureRewardSection from "./TreasureRewardSection";

export default function TreasureScrollExperience() {
  return (
    <div className="relative w-full flex flex-col items-center py-12 sm:py-20 px-4">
      {/* TREASURE OF THE DAY heading */}
      <div className="mb-6 sm:mb-8 text-center">
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold uppercase tracking-[0.15em] leading-tight"
          style={{
            fontFamily: "var(--font-cinzel), serif",
            background:
              "linear-gradient(180deg, #f4d97a 0%, #c9a84c 35%, #a07c2a 65%, #d4af5e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter:
              "drop-shadow(0 2px 6px rgba(201,168,76,0.35)) drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
          }}
        >
          Treasure of the Day
        </h2>
      </div>

      {/* Reward card */}
      <div className="w-full max-w-[1000px]">
        <TreasureRewardSection />
      </div>
    </div>
  );
}
