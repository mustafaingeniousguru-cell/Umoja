"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Lanyard from "./3d/Lanyard";

type DragCardProps = {
  onDragComplete: () => void;
};

export default function DragCard({ onDragComplete }: DragCardProps) {
  return (
    <motion.div
      key="drag-card-container"
      exit={{ opacity: 0, scale: 0.8, height: 0, overflow: "hidden" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col items-center w-full"
    >
      <div className="text-center z-20 relative">
        <h2 className="text-2xl sm:text-5xl md:text-7xl font-black text-[#c9a84c] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(201,168,76,0.4)]">
          Treasure Box
        </h2>
      </div>

      <div className="w-full relative z-10 -my-4 sm:-my-10 bg-transparent">
        <Lanyard
          position={[0, 0, 25]}
          gravity={[0, -20, 0]}
          frontImage="/UTC_logo_png-01.png"
          imageFit="contain"
          onDragChange={(dragging: boolean) => {
            if (dragging) onDragComplete();
          }}
        />
      </div>

      <div className="flex flex-col items-center z-20 relative -mt-4">
        <p className="text-white font-black text-base sm:text-3xl tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
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
  );
}
