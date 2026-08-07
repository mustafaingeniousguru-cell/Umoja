"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";

type ChestPhase = "closed" | "unlocking" | "shaking" | "opening" | "open";

interface SparkParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  riseHeight: number;
}

interface LightRay {
  id: number;
  angle: number;
  length: number;
  delay: number;
}

export default function TreasureChestAnimation({ onChestOpen, onComplete }: { onChestOpen?: () => void; onComplete?: () => void }) {
  const [phase, setPhase] = useState<ChestPhase>("closed");
  const [fadingOut, setFadingOut] = useState(false);
  const [sparks, setSparks] = useState<SparkParticle[]>([]);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [lightRays, setLightRays] = useState<LightRay[]>([]);
  const hasOpenedRef = useRef(false);
  const chestWrapperRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const onChestOpenRef = useRef(onChestOpen);
  onCompleteRef.current = onComplete;
  onChestOpenRef.current = onChestOpen;

  // Generate spark particles for unlock moment
  const generateSparks = useCallback(() => {
    const newSparks: SparkParticle[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const distance = 40 + Math.random() * 60;
      newSparks.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 0.2,
      });
    }
    setSparks(newSparks);
  }, []);

  // Generate continuous floating particles for open state
  const generateFloatingParticles = useCallback(() => {
    const newParticles: FloatingParticle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: 0,
        size: 1 + Math.random() * 4,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        riseHeight: 100 + Math.random() * 80,
      });
    }
    setFloatingParticles(newParticles);
  }, []);

  // Generate light rays for open state
  const generateLightRays = useCallback(() => {
    const rays: LightRay[] = [];
    for (let i = 0; i < 12; i++) {
      rays.push({
        id: i,
        angle: (360 / 12) * i + Math.random() * 15,
        length: 100 + Math.random() * 80,
        delay: Math.random() * 0.5,
      });
    }
    setLightRays(rays);
  }, []);

  // Start the unlock sequence when component mounts (after drag is complete)
  // Guard against React StrictMode double-invoke — chest opens ONLY ONCE
  useEffect(() => {
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;

    // GSAP cinematic entrance: fade in + scale 0.8→1 + soft bounce
    if (chestWrapperRef.current) {
      gsap.fromTo(
        chestWrapperRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.4)" }
      );
    }

    // Idle phase: chest stays closed for ~1.5s after entrance completes
    const t1 = setTimeout(() => {
      setPhase("unlocking");
      generateSparks();
    }, 2000);

    const t2 = setTimeout(() => {
      setPhase("shaking");
    }, 3000);

    const t3 = setTimeout(() => {
      setPhase("opening");
    }, 3500);

    const t4 = setTimeout(() => {
      setPhase("open");
      generateFloatingParticles();
      generateLightRays();
      // Notify parent that chest is fully open — parent can now render the section
      onChestOpenRef.current?.();
    }, 4300);

    // After chest is open and section has emerged, start fading the overlay
    const t5 = setTimeout(() => {
      setFadingOut(true);
    }, 5500);

    // Remove overlay after fade completes
    const t6 = setTimeout(() => {
      onCompleteRef.current?.();
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [generateSparks, generateFloatingParticles, generateLightRays]);

  // Continuous particle regeneration in open state
  useEffect(() => {
    if (phase !== "open") return;
    const interval = setInterval(() => {
      generateFloatingParticles();
    }, 5000);
    return () => clearInterval(interval);
  }, [phase, generateFloatingParticles]);

  const isChestOpen = phase === "opening" || phase === "open";
  const isUnlocking = phase === "unlocking" || phase === "shaking";

  return (
    <AnimatePresence>
      {!fadingOut && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(4,10,20,0.92) 0%, rgba(2,6,12,0.98) 70%)",
          }}
        >
      {/* === CHEST ENTRANCE WRAPPER (GSAP animated) === */}
      <div ref={chestWrapperRef} className="will-change-transform">
      {/* === CHEST CONTAINER === */}
      <motion.div
        className="relative w-full max-w-[300px] sm:max-w-[500px] md:max-w-[600px] aspect-square"
        animate={
          phase === "closed"
            ? { y: [0, -8, 0], scale: [1, 1.02, 1] }
            : phase === "shaking"
              ? { x: [0, -6, 6, -4, 4, 0], scale: [1, 1.08, 1.06, 1.08, 1] }
              : phase === "opening"
                ? { scale: [1.08, 1.15, 1.12] }
                : phase === "open"
                  ? { scale: 1.12 }
                  : { scale: 1 }
        }
        transition={
          phase === "closed"
            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
            : phase === "shaking"
              ? { duration: 0.5, ease: "easeInOut" }
              : phase === "opening"
                ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                : { duration: 0.3 }
        }
      >
        {/* === IDLE GLOW (closed phase anticipation) === */}
        {phase === "closed" && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] pointer-events-none rounded-full"
            animate={{
              opacity: [0.15, 0.35, 0.15],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "70%",
              height: "70%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        )}

        {/* === SHADOW UNDERNEATH === */}
        <motion.div
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 rounded-full bg-black/60 blur-md pointer-events-none"
          animate={{
            width: phase === "closed" ? ["55%", "48%", "55%"] : "40%",
            opacity: phase === "closed" ? [0.5, 0.35, 0.5] : 0.3,
          }}
          transition={{
            duration: 4,
            repeat: phase === "closed" ? Infinity : 0,
            ease: "easeInOut",
          }}
          style={{ height: "8%" }}
        />

        {/* === GLOWING LOCK AREA === */}
        {isUnlocking && (
          <motion.div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0.8], scale: [0.5, 1.5, 1.8, 1.5] }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,215,100,0.9) 0%, rgba(201,168,76,0.5) 40%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
          </motion.div>
        )}

        {/* === SPARK PARTICLES === */}
        {isUnlocking && (
          <div className="absolute top-[38%] left-1/2 z-40 pointer-events-none">
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                className="absolute rounded-full"
                style={{
                  width: spark.size,
                  height: spark.size,
                  background:
                    "radial-gradient(circle, #ffd700 0%, #c9a84c 60%, transparent 100%)",
                  boxShadow: "0 0 6px rgba(255,215,0,0.8)",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: spark.x,
                  y: spark.y,
                  opacity: [1, 0.8, 0],
                  scale: [1, 0.5, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: spark.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        {/* === GLOW PULSE RING === */}
        {isUnlocking && (
          <motion.div
            className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none rounded-full border-2 border-[#c9a84c]"
            initial={{ width: 20, height: 20, opacity: 1 }}
            animate={{ width: [20, 120, 160], height: [20, 120, 160], opacity: [1, 0.5, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {/* === CHEST IMAGE (single AnimatePresence, no flicker) === */}
        <AnimatePresence mode="wait">
          {!isChestOpen ? (
            <motion.div
              key="closed-chest"
              className="absolute inset-0 z-10"
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.25,
                filter: "blur(10px)",
              }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image
                src="/amoja_treasure-01.png"
                alt="Closed Treasure Chest"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                sizes="(max-width: 768px) 300px, 600px"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="open-chest"
              className="absolute inset-0 z-10"
              initial={{ opacity: 0, scale: 0.6, filter: "blur(15px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/amoja_treasure2-01.png"
                alt="Open Treasure Chest"
                fill
                className="object-contain drop-shadow-[0_10px_30px_rgba(201,168,76,0.4)]"
                sizes="(max-width: 768px) 300px, 600px"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* === GOLDEN LIGHT FROM INSIDE === */}
        {isChestOpen && (
          <motion.div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0.9, 0.7, 0.9], scale: [0.3, 1.2, 1, 1.1] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div
              className="w-32 h-32 sm:w-48 sm:h-48 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,220,100,0.8) 0%, rgba(201,168,76,0.4) 30%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          </motion.div>
        )}

        {/* === LIGHT RAYS === */}
        {isChestOpen && (
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
            {lightRays.map((ray) => (
              <motion.div
                key={ray.id}
                className="absolute origin-bottom"
                style={{
                  width: "3px",
                  height: `${ray.length}px`,
                  background:
                    "linear-gradient(to top, rgba(255,215,100,0.6) 0%, transparent 100%)",
                  transform: `rotate(${ray.angle}deg)`,
                  transformOrigin: "bottom center",
                  filter: "blur(1px)",
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                  opacity: [0, 0.7, 0.4, 0.6],
                  scaleY: [0, 1, 0.9, 1],
                }}
                transition={{
                  duration: 1.5,
                  delay: ray.delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* === FLOATING PARTICLES (Dust/Sparkles) === */}
        {isChestOpen && (
          <div className="absolute top-[25%] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            {floatingParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background:
                    "radial-gradient(circle, rgba(255,215,100,0.9) 0%, rgba(201,168,76,0.4) 50%, transparent 100%)",
                  boxShadow: "0 0 4px rgba(255,215,0,0.6)",
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: p.x,
                  y: [0, -p.riseHeight],
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.5, 1, 0.8, 0.3],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}

        {/* === ZOOM-IN OVERLAY (camera zoom effect) === */}
        {phase === "opening" && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none rounded-full"
            initial={{ scale: 0.5, opacity: 0.3 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(255,220,100,0.3) 0%, transparent 60%)",
            }}
          />
        )}
      </motion.div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
