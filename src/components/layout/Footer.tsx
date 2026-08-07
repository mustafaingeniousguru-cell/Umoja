"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const footerLinks = {
  Collections: [
    "Pokémon TCG",
    "One Piece TCG",
    "Dragon Ball Super",
    "Premium Figures",
    "Upcoming Releases",
  ],
  "Treasure Club": ["Member Sign In", "Join the Club", "Loyalty Program", "Wishlist"],
  "Support & Info": [
    "Shipping & Fulfillment",
    "Returns & Authenticity",
    "Contact Us",
    "Track Order",
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-[#c9a84c]/10 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #040a14 0%, #02060d 100%)',
      }}
    >
      {/* Top shadow glow */}
      <div className="absolute top-0 left-0 w-full h-[150px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(10, 25, 50, 0.5) 0%, transparent 70%)' }}
      />
      {/* Top divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Image
              src="/UTC_logo_png-01.png"
              alt="Umoja Treasure Co."
              width={80}
              height={80}
              className="rounded-full mb-4 w-14 h-14 sm:w-20 sm:h-20 object-contain"
            />
            <p className="text-sm text-white/70 leading-relaxed max-w-xs mb-6">
              San Antonio & Kansas's premier hobby destination for trading cards, toys and collectibles. Built by collectors, for collectors.
            </p>
            {/* Social dots */}
            <div className="flex items-center gap-3">
              {["IG", "X", "DC"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[10px] font-bold text-[#c9a84c] hover:border-[#c9a84c]/60 hover:text-[#c9a84c] transition-all duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
            >
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white hover:text-[#c9a84c] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60">
            &copy; 2026 Umoja Treasure Company. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/60 hover:text-[#c9a84c] transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/60 hover:text-[#c9a84c] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
