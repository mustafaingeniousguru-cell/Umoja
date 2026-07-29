"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Shop", href: "#new-arrivals" },
  { label: "Pre-Orders", href: "#treasure" },
  { label: "About", href: "#how-it-works" },
  { label: "Shipping", href: "#categories" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-2 pt-2 pb-2"
    >
      <div
        className={`transition-all duration-500 rounded-b-2xl ${
          scrolled
            ? "bg-[#0a1628]/80 backdrop-blur-2xl border border-[#c9a84c]/10 border-t-0 py-2"
            : "bg-transparent py-2"
        }`}
        style={
          scrolled
            ? {
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(201,168,76,0.08)",
              }
            : undefined
        }
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-3 items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group justify-self-start">
            <Image
              src="/UTC_logo_png-01.png"
              alt="Umoja Treasure Co."
              width={56}
              height={56}
              className="rounded-full group-hover:opacity-80 transition-opacity"
            />
          </a>

          {/* Desktop Nav — Centered */}
          <nav className="hidden lg:flex items-center gap-10 justify-self-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base text-white hover:text-[#c9a84c] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[#c9a84c] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4 justify-self-end">
            <div className="hidden sm:flex items-center gap-6">
              <button className="flex items-center gap-2 text-xs text-white hover:text-[#c9a84c] uppercase tracking-[0.15em] transition-colors duration-300 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Wishlist
              </button>
              <button className="flex items-center gap-2 text-xs text-white hover:text-[#c9a84c] uppercase tracking-[0.15em] transition-colors duration-300 cursor-pointer">
                <ShoppingBag className="w-4 h-4" />
                Cart
                <span className="bg-[#c9a84c] text-[#0a1628] rounded-full w-[18px] h-[18px] text-[0.65rem] flex items-center justify-center font-bold">0</span>
              </button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c9a84c]/30 text-white hover:bg-[#c9a84c] hover:text-[#0a1628] font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
              >
                Sign In
              </motion.button>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-[#c9a84c]" />
              ) : (
                <Menu className="w-6 h-6 text-[#c9a84c]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a1628]/95 backdrop-blur-2xl border-b border-[#c9a84c]/15 px-6 py-6 overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-white hover:text-[#c9a84c] transition-colors uppercase tracking-wide"
                >
                  {link.label}
                </a>
              ))}
              <button className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#c9a84c]/30 text-[#c9a84c] font-bold text-sm cursor-pointer uppercase tracking-widest">
                Sign In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
