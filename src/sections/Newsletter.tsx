"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Newsletter() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="relative w-full py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d2138 0%, #081628 40%, #040a14 100%)',
      }}
    >
      {/* Top shadow glow */}
      <div className="absolute top-0 left-0 w-full h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 100% at 60% 0%, rgba(15, 35, 70, 0.5) 0%, transparent 70%)' }}
      />
      {/* Dynamic Background Mesh / Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />
      
      {/* Central Glowing Orb */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a84c] rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10">
        
        {/* Floating Premium Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] p-8 md:p-16 overflow-hidden bg-[#0a1628]/80 backdrop-blur-2xl border-[2px] border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Subtle Card Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Umoja Logo Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image
              src="/UTC_logo_png-01.png"
              alt=""
              width={600}
              height={600}
              className="opacity-[0.08] rounded-full"
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-8 shadow-inner">
                <Mail className="w-8 h-8 text-[#c9a84c]" strokeWidth={1.5} />
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-wider leading-[1.1]">
                Get Early Information<br/>
                <span className="text-[#c9a84c]">on New Treasures</span>
              </h2>
              
              <p className="text-white/90 text-lg leading-relaxed mb-8 max-w-md">
                Join the Umoja mailing list and be the first to know about restocks, new sets, exclusive drops, and member deals.
              </p>

              <ul className="flex flex-col gap-3 mb-2">
                <li className="flex items-center gap-3 text-white/90 text-sm">
                  <span className="text-[#c9a84c]">&#9670;</span>
                  Early restock alerts
                </li>
                <li className="flex items-center gap-3 text-white/90 text-sm">
                  <span className="text-[#c9a84c]">&#9670;</span>
                  Exclusive member deals
                </li>
                <li className="flex items-center gap-3 text-white/90 text-sm">
                  <span className="text-[#c9a84c]">&#9670;</span>
                  New set announcements
                </li>
              </ul>
            </div>

            {/* Right Form Area */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="w-full max-w-[450px] p-8 rounded-3xl bg-[#060e1b]/80 backdrop-blur-xl border border-white/5 shadow-2xl relative">
                
                {/* Form Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-[-2px] rounded-[1.6rem] bg-gradient-to-r from-[#c9a84c]/50 via-blue-500/50 to-[#c9a84c]/50 blur-md" />
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div>
                    <label className="block text-xs font-black text-white/80 uppercase tracking-[0.2em] mb-3 ml-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="your@email.com"
                        className="w-full px-6 py-5 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a84c] focus:bg-white/10 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-[#c9a84c] text-[#060e1b] font-black uppercase tracking-widest overflow-hidden transition-shadow hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                  >
                    <span className="relative z-10">Subscribe</span>
                    <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-2" />
                    
                    {/* Button Hover Sweep */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </motion.button>

                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
