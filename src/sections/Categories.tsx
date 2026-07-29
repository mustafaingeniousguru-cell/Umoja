"use client";

import { motion } from "framer-motion";
import MagicBento from "@/components/ui/MagicBento";

const categoryData = [
  {
    title: "All Treasures",
    description: "Browse everything in store — sealed product, singles, figures, and more.",
    label: "All",
    image: "/treasure box.webp",
    color: '#0a1628'
  },
  {
    title: "Pokémon TCG",
    description: "Booster boxes, packs, and singles from the Scarlet & Violet era and beyond.",
    label: "Pokémon",
    image: "/pokeman TCG.webp",
    color: '#0a1628'
  },
  {
    title: "One Piece TCG",
    description: "Leader decks, booster boxes, and promo cards from the One Piece Card Game.",
    label: "One Piece",
    image: "/ONE piece card game.webp",
    color: '#0a1628'
  },
  {
    title: "Dragon Ball Super",
    description: "Booster boxes and starter decks from Dragon Ball Super Card Game.",
    label: "DBS",
    image: "/Dragon ball super.webp",
    color: '#0a1628'
  },
  {
    title: "Funko POP!",
    description: "Collectible Funko POP! figures from your favorite anime and game franchises.",
    label: "Funko",
    image: "/funko pop.jfif",
    color: '#0a1628'
  },
  {
    title: "Other Collectibles",
    description: "Hot Wheels, graded slabs, toys, and exclusive limited-edition treasures.",
    label: "More",
    image: "/Others.jfif",
    color: '#0a1628'
  }
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="relative w-full py-24 lg:py-32 overflow-hidden border-y-[4px] border-[#c9a84c]/20"
      style={{
        background: 'linear-gradient(180deg, #081628 0%, #0d2138 40%, #0a1a2e 100%)',
      }}
    >
      {/* Top shadow glow */}
      <div className="absolute top-0 left-0 w-full h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 100% at 70% 0%, rgba(18, 45, 85, 0.5) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <span className="text-sm font-black tracking-[0.3em] text-[#c9a84c] uppercase mb-3 block drop-shadow-md">
              Shop By Category
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 uppercase tracking-wider drop-shadow-lg">
              Shop by Category
            </h2>
          </div>
        </motion.div>
        <div className="relative w-full">
          <MagicBento 
            cardData={categoryData}
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={250}
            particleCount={8}
            glowColor="201, 168, 76"
          />
        </div>
      </div>
    </section>
  );
}
