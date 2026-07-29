"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const bundles = [
  {
    id: "basic",
    badge: "STARTER TIER",
    icons: ["BOX", "PACK"],
    title: "RARE CHEST",
    description: "Everything a new collector needs to dive in — a booster box, 10 packs, and a card binder.",
    features: [
      "1x Booster Box",
      "10x Booster Packs (mixed)",
      "1x Card Binder (200 slots)"
    ],
    price: "$169.99",
    originalPrice: "$195.00",
    buttonText: "Claim Chest",
    buttonVariant: "secondary"
  },
  {
    id: "moderate",
    badge: "COLLECTOR TIER",
    icons: ["BOX", "BOX", "FIG"],
    title: "EPIC CHEST",
    description: "Two booster boxes, a Funko figure, and premium sleeves — the full hobby experience.",
    features: [
      "2x Booster Boxes (your choice)",
      "1x Funko POP! Figure",
      "1x Premium Sleeve Pack"
    ],
    price: "$299.99",
    originalPrice: "$340.00",
    buttonText: "Claim Chest",
    buttonVariant: "primary"
  },
  {
    id: "premium",
    badge: "ULTIMATE TIER",
    icons: ["BOX", "BOX", "SLAB"],
    title: "LEGENDARY CHEST",
    description: "The ultimate haul — a sealed case, a graded slab, and tournament-grade storage.",
    features: [
      "3x Booster Boxes (your choice)",
      "1x Graded Slab (PSA 9+)",
      "1x Premium Storage Case"
    ],
    price: "$549.99",
    originalPrice: "$640.00",
    buttonText: "Claim Chest",
    buttonVariant: "secondary"
  }
];

export default function TreasureChest() {
  return (
    <section id="bundles" className="relative w-full py-24 lg:py-32 overflow-hidden border-t-[4px] border-[#c9a84c]/20"
      style={{
        background: 'linear-gradient(180deg, #0a1a2e 0%, #0e2440 40%, #0b1d34 100%)',
      }}
    >
      {/* Top shadow glow */}
      <div className="absolute top-0 left-0 w-full h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 40% 0%, rgba(22, 55, 100, 0.5) 0%, transparent 70%)' }}
      />
      {/* Premium Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Main Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs font-black tracking-[0.2em] text-[#c9a84c] uppercase mb-4 drop-shadow-md">
              Curated Collections
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white uppercase tracking-wider drop-shadow-lg font-bold mb-6">
              Treasure Chests
            </h2>
            <p className="text-white/90 max-w-[600px] mx-auto text-lg font-light leading-relaxed">
              Expertly assembled bundles offering the ultimate unboxing experience and unbeatable value.
            </p>
          </motion.div>
        </div>

        {/* 3 Column Grid for Premium Bundles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-10">
          {bundles.map((bundle, idx) => {
            const isCollector = bundle.badge === "COLLECTOR TIER";
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative flex flex-col p-8 sm:p-10 rounded-2xl bg-[#0a1628]/80 backdrop-blur-xl border-[2px] transition-all duration-300 group
                  ${isCollector ? 'border-[#c9a84c] md:-translate-y-5 shadow-[0_20px_50px_rgba(201,168,76,0.15)]' : 'border-white/10 hover:border-[#c9a84c]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}
                `}
              >
                {/* Badge (Top Left inner) */}
                <div className={`text-xs font-black tracking-widest mb-6 ${isCollector ? 'text-[#c9a84c]' : 'text-white/80'}`}>
                  {bundle.badge}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-serif font-bold text-white mb-4">
                  {bundle.title}
                </h3>

                {/* Tag Labels */}
                <div className="flex items-center gap-2 mb-6">
                  {bundle.icons.map((icon, i) => (
                    <span key={i} className="px-3 py-1 rounded-md text-[10px] font-black tracking-widest border border-[#c9a84c]/20 text-[#c9a84c]/70 bg-[#c9a84c]/5">
                      {icon}
                    </span>
                  ))}
                </div>
                
                {/* Description */}
                <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-8 min-h-[60px]">
                  {bundle.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3">
                    <span className={`text-4xl font-bold ${isCollector ? 'text-[#c9a84c]' : 'text-white'}`}>
                      {bundle.price}
                    </span>
                    <span className="text-sm text-white/70 line-through">
                      {bundle.originalPrice}
                    </span>
                  </div>
                </div>

                {/* Checkmarks / Features */}
                <div className="flex flex-col gap-4 mb-10 flex-grow">
                  {bundle.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] shrink-0 mt-2" />
                      <span className="text-sm sm:text-base text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Section */}
                <div className="mt-auto">
                  <button className={`w-full py-4 rounded font-bold uppercase tracking-wider text-sm transition-all duration-300
                    ${isCollector 
                      ? 'bg-[#c9a84c] text-[#0a1628] hover:bg-white hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]' 
                      : 'bg-transparent border border-white/20 text-white hover:border-[#c9a84c] hover:text-[#c9a84c]'}
                  `}>
                    {bundle.buttonText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
