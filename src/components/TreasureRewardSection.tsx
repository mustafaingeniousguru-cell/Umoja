"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ── Countdown Block ────────────────────────────────────── */

function CountdownBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border-[2px] sm:border-[3px] border-[#c9a84c] bg-[#040a14] flex items-center justify-center shadow-[inset_0_5px_15px_rgba(0,0,0,0.8),0_5px_10px_rgba(0,0,0,0.5)]">
        <span
          key={value}
          className="text-base sm:text-3xl font-black text-white tabular-nums font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
        >
          {value}
        </span>
      </div>
      <span className="text-[8px] sm:text-xs text-white uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-1.5 sm:mt-2 font-black">
        {label}
      </span>
    </div>
  );
}

/* ── Component ──────────────────────────────────────────── */

export default function TreasureRewardSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="w-full">
      <div className="w-full max-w-[1000px] mx-auto rounded-[1.5rem] sm:rounded-[2rem] border-[3px] sm:border-[4px] border-[#c9a84c] bg-[#040a14] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(201,168,76,0.1)] p-6 sm:p-8 md:p-10 relative flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 z-20 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Left: Content */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
          <span className="text-[10px] sm:text-sm text-[#c9a84c] uppercase tracking-[0.3em] font-black mb-2">
            Limited Edition
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
            Treasure of the Day
          </h3>
          <p className="text-xs sm:text-base text-white/70 mb-4 max-w-[400px] leading-relaxed">
            A premium mystery hobby box curated for the ultimate collector. Sealed product, singles, and exclusive surprises await.
          </p>

          {/* Countdown */}
          <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-4 mb-5">
            <CountdownBlock value={pad(timeLeft.hours)} label="Hours" />
            <span className="text-xl sm:text-4xl text-[#c9a84c] font-black mt-[-14px] sm:mt-[-20px]">:</span>
            <CountdownBlock value={pad(timeLeft.minutes)} label="Minutes" />
            <span className="text-xl sm:text-4xl text-[#c9a84c] font-black mt-[-14px] sm:mt-[-20px]">:</span>
            <CountdownBlock value={pad(timeLeft.seconds)} label="Seconds" />
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl sm:text-4xl font-black text-[#c9a84c] drop-shadow-lg">$59.99</span>
          </div>
          <button className="px-8 sm:px-12 py-3 sm:py-4 rounded-full bg-[#c9a84c] text-[#040a14] font-black text-xs sm:text-base uppercase tracking-widest border-2 border-[#c9a84c] hover:bg-transparent hover:text-[#c9a84c] transition-all duration-300 shadow-[0_10px_30px_rgba(201,168,76,0.4)]">
            Claim Treasure
          </button>
        </div>

        {/* Right: Chest Image */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="relative w-full max-w-[180px] sm:max-w-[280px] aspect-square">
            <Image
              src="/amoja_treasure2-01.png"
              alt="Open Treasure Chest"
              fill
              className="object-contain drop-shadow-[0_10px_30px_rgba(201,168,76,0.4)]"
              sizes="(max-width: 768px) 180px, 280px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
