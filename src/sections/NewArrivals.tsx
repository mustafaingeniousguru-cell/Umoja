"use client";

import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";

const products = [
  {
    name: "Pokémon S&V Stellar Crown Booster Box",
    badge: "New",
    price: "$139.99",
    image: "/pb_bb.png",
  },
  {
    name: "Yu-Gi-Oh! Phantom Nightmare Booster Box",
    badge: "Hot",
    price: "$84.99",
    image: "/Yu-Gi-Oh__Phantom_Nightmare_Booster_Box-removebg-preview.png",
  },
  {
    name: "Magic: The Gathering — Final Fantasy Bundle",
    badge: "New",
    price: "$54.99",
    image: "/Magic_The_Gathering_Final_Fantasy_Bundle-removebg-preview.png",
  },
  {
    name: "One Piece Card Game — Royal Blood Booster Box",
    badge: "Hot",
    price: "$99.99",
    image: "/One_Piece_Card_Game_Royal_Blood_Booster_Box-removebg-preview.png",
  },
];

function ProductCard({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border-2 sm:border-[4px] border-[#c9a84c]/20 hover:border-[#c9a84c]/80 transition-colors duration-500 bg-[#060e1b]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
      >
        {/* Image */}
        <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden p-2 sm:p-4">
          <div
            className="absolute inset-2 sm:inset-4 bg-contain bg-no-repeat bg-center group-hover:scale-110 transition-transform duration-700"
            style={{ backgroundImage: `url("${product.image}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1b] via-[#060e1b]/40 to-transparent" />

          {/* Badge */}
          <span
            className={`absolute top-1 left-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] shadow-lg ${
              product.badge === "Hot"
                ? "bg-[#c9a84c] text-[#0a1628]"
                : product.badge === "Limited"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white backdrop-blur-md border border-white/20"
            }`}
          >
            {product.badge}
          </span>

          {/* Quick view overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0a1628]/60 backdrop-blur-sm z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-6 sm:py-3 rounded-full border-2 sm:border-[2px] border-[#c9a84c] bg-[#0a1628]/80 shadow-[0_0_20px_rgba(201,168,76,0.4)]">
              <Eye className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#c9a84c]" />
              <span className="text-[10px] sm:text-sm text-white font-black uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                Quick View
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-2 sm:p-6 relative z-20 bg-[#060e1b]/80">
          <h3 className="text-[10px] sm:text-lg font-black text-white mb-1 sm:mb-2 uppercase tracking-wide group-hover:text-[#c9a84c] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-sm sm:text-2xl font-black text-[#c9a84c] drop-shadow-md">{product.price}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NewArrivals() {
  return (
    <section
      id="new-arrivals"
      className="relative w-full py-12 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #061224 0%, #0b1d34 40%, #081628 100%)',
      }}
    >
      {/* Top shadow glow */}
      <div className="absolute top-0 left-0 w-full h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 100% at 30% 0%, rgba(15, 40, 75, 0.6) 0%, transparent 70%)' }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 sm:mb-16 gap-3"
        >
          <div>
            <span className="text-xs font-black tracking-[0.2em] text-[#c9a84c] uppercase mb-2 block drop-shadow-md">
              Newly Discovered
            </span>
            <h2 className="text-xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider drop-shadow-lg">
              The Latest Treasures
            </h2>
          </div>
          <button className="group flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full border-2 border-[#c9a84c] text-xs sm:text-sm text-[#c9a84c] font-black uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#0a1628] transition-all cursor-pointer shadow-[0_0_15px_rgba(201,168,76,0.2)]">
            Explore All Treasures
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
          {products.map((product, idx) => (
            <ProductCard key={product.name} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
