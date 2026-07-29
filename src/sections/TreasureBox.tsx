"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Lanyard from "../components/3d/Lanyard";

function CountdownBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl border-[3px] border-[#c9a84c] bg-[#040a14] flex items-center justify-center shadow-[inset_0_5px_15px_rgba(0,0,0,0.8),0_5px_10px_rgba(0,0,0,0.5)]">
        <motion.span
          key={value}
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl sm:text-4xl font-black text-white tabular-nums font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
        >
          {value}
        </motion.span>
      </div>
      <span className="text-[10px] sm:text-xs text-white uppercase tracking-[0.2em] mt-3 font-black">
        {label}
      </span>
    </div>
  );
}

export default function TreasureBox() {
  const [isRevealed, setIsRevealed] = useState(false);
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
    <section
      id="treasure"
      className="relative w-full py-16 lg:py-24 flex flex-col items-center justify-center border-y-[4px] border-[#c9a84c]/20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050b16 0%, #0a1a2e 40%, #061224 100%)',
      }}
    >
      {/* Top shadow glow */}
      <div className="absolute top-0 left-0 w-full h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(20, 50, 90, 0.5) 0%, transparent 70%)' }}
      />
      {/* Background Ambience */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="drag-card-container"
              exit={{ opacity: 0, scale: 0.8, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center w-full"
            >
              {/* CLEANED UP HEADER: JUST "TREASURE BOX" */}
              <div className="text-center z-20 relative">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#c9a84c] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(201,168,76,0.4)]">
                  Treasure Box
                </h2>
              </div>

              {/* 3D Lanyard Drag Target (Negative Margin to pull layout tight) */}
              <div className="w-full relative z-10 -my-4 sm:-my-10 bg-transparent">
                <Lanyard 
                  position={[0, 0, 25]} 
                  gravity={[0, -20, 0]} 
                  frontImage="/UTC_logo_png-01.png"
                  imageFit="contain"
                  onDragChange={(dragging: boolean) => {
                    if (dragging) setIsRevealed(true);
                  }}
                />
              </div>

              {/* CLEANED UP FOOTER: JUST "DRAG IT" AND ARROW */}
              <div className="flex flex-col items-center z-20 relative -mt-4">
                <p className="text-white font-black text-3xl tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                  Drag It
                </p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-10 h-10 text-[#c9a84c] mt-2 drop-shadow-lg" />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="revealed-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full overflow-hidden"
            >
              {/* HORIZONTAL WIDE SECTION, REDUCED HEIGHT */}
              <div className="w-full max-w-[1000px] mx-auto rounded-[2rem] border-[4px] border-[#c9a84c] bg-[#040a14] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(201,168,76,0.1)] p-8 sm:p-12 relative flex flex-col md:flex-row items-center justify-between gap-10 mt-8 z-20">
                
                {/* Left Side: Premium Content & CTA */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 relative z-10">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 uppercase tracking-wider drop-shadow-lg">
                    Treasure<br />Of The Day
                  </h2>
                  <p className="text-lg text-[#c9a84c] font-bold mb-8 tracking-widest uppercase">
                    Premium Mystery Hobby Box
                  </p>

                  {/* Compact Horizontal Countdown Blocks */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-10">
                    <CountdownBlock value={pad(timeLeft.hours)} label="Hours" />
                    <span className="text-4xl text-[#c9a84c] font-black mt-[-20px]">:</span>
                    <CountdownBlock value={pad(timeLeft.minutes)} label="Minutes" />
                    <span className="text-4xl text-[#c9a84c] font-black mt-[-20px]">:</span>
                    <CountdownBlock value={pad(timeLeft.seconds)} label="Seconds" />
                  </div>

                  {/* Solid Gold Heavy CTA */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-10 py-5 rounded-[2rem] bg-[#c9a84c] text-white font-black text-xl uppercase tracking-widest border-[4px] border-[#c9a84c] hover:bg-[#040a14] transition-all duration-300 shadow-[0_15px_30px_rgba(201,168,76,0.3)] whitespace-nowrap"
                  >
                    Secure Bounty &mdash; $59.99
                  </motion.button>
                </div>

                {/* Right Side: Heavy Chest Image/SVG */}
                <div className="w-full md:w-[400px] flex items-center justify-center relative z-10">
                  {/* Glowing backdrop for the chest */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.2)_0%,transparent_60%)] pointer-events-none rounded-[2.5rem]" />
                  
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full max-w-[280px] aspect-square"
                  >
                    <svg viewBox="0 0 200 180" className="relative w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" fill="none">
                      <rect x="30" y="80" width="140" height="80" rx="8" fill="#040a14" stroke="#c9a84c" strokeWidth="6" />
                      <path d="M30 80 Q30 40 100 35 Q170 40 170 80 Z" fill="#0a1628" stroke="#c9a84c" strokeWidth="6" />
                      <motion.ellipse
                        cx="100" cy="80" rx="50" ry="8" fill="#c9a84c"
                        animate={{ opacity: [0.8, 1, 0.8], rx: [48, 52, 48] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <rect x="24" y="95" width="152" height="8" fill="#c9a84c" />
                      <rect x="24" y="145" width="152" height="8" fill="#c9a84c" />
                      <rect x="80" y="65" width="40" height="30" rx="4" fill="#040a14" stroke="#c9a84c" strokeWidth="4" />
                      <circle cx="100" cy="80" r="6" fill="#c9a84c" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
