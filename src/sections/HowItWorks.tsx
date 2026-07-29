"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Lock, Truck, Sparkles, MoveRight } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    id: "01",
    title: "Browse",
    desc: "Shop sealed product, singles, figures, and accessories — all from trusted hobby brands.",
    icon: Search,
    color: "from-[#c9a84c]/10 to-[#0a1628]/10",
    border: "group-hover:border-[#c9a84c]/50"
  },
  {
    id: "02",
    title: "Collect",
    desc: "Mix categories, grab a treasure chest, or hunt for your holy grail. No minimum order required.",
    icon: ShoppingCart,
    color: "from-[#c9a84c]/10 to-[#0a1628]/10",
    border: "group-hover:border-[#c9a84c]/50"
  },
  {
    id: "03",
    title: "Secure",
    desc: "Pay your way — Card, PayPal, Crypto, Apple Pay. 100% SSL-secured, PCI-compliant checkout.",
    icon: Lock,
    color: "from-[#c9a84c]/10 to-[#0a1628]/10",
    border: "group-hover:border-[#c9a84c]/50"
  },
  {
    id: "04",
    title: "Receive",
    desc: "Fast, tracked shipping. Free over $300 (or $150 for members). Packed with collector-grade care.",
    icon: Truck,
    color: "from-[#c9a84c]/10 to-[#0a1628]/10",
    border: "group-hover:border-[#c9a84c]/50"
  }
];

export default function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full py-24 lg:py-32 bg-[#060e1b] overflow-hidden border-y-[2px] border-white/5">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#c9a84c]/5 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#c9a84c]/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#c9a84c]" />
              <span className="text-sm font-bold tracking-[0.2em] text-[#c9a84c] uppercase">The Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider drop-shadow-lg">
              Seamless Collecting
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 max-w-sm text-base md:text-lg leading-relaxed"
          >
            Four steps between you and the ultimate collector's experience. We handle the curation; you enjoy the thrill.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative p-8 sm:p-10 rounded-[2rem] bg-[#0a1628] border-2 border-white/5 transition-all duration-500 hover:bg-[#0c1a30] overflow-hidden ${step.border}`}
            >
              {/* Animated Gradient Background */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Step Number Watermark */}
              <div className="absolute -top-6 -right-6 text-[150px] font-black text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-500 select-none pointer-events-none">
                {step.id}
              </div>

              {/* Icon Container */}
              <div className="relative mb-12">
                <div className="w-20 h-20 rounded-2xl bg-[#060e1b] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  <step.icon className="w-10 h-10 text-white group-hover:text-[#c9a84c] transition-colors duration-500" strokeWidth={1.5} />
                </div>
                
                {/* Connecting Line (Only visible on Desktop, except last item) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-[100%] w-[100px] h-[2px] -translate-y-1/2 overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: idx * 0.5 }}
                      className="w-full h-full bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-4 tracking-wide group-hover:text-[#c9a84c] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-white/90 leading-relaxed text-base">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Interactive Arrow */}
              <div className="absolute bottom-10 right-10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <MoveRight className="w-6 h-6 text-[#c9a84c]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
