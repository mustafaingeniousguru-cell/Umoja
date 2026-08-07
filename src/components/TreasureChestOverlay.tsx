"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";

/* ── Types ──────────────────────────────────────────────── */

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

/* ── Component ──────────────────────────────────────────── */

type TreasureChestOverlayProps = {
  onChestOpen: () => void;
  onRewardShow: () => void;
  onOverlayComplete: () => void;
};

/* Closed chest image path */
const CLOSED_CHEST = "/amoja_treasure2-01.png";
/* Open chest image path */
const OPEN_CHEST = "/amoja_treasure-01.png";
/* Lid split point — top ~38% is the lid */
const LID_SPLIT = 38;

export default function TreasureChestOverlay({
  onChestOpen,
  onRewardShow,
  onOverlayComplete,
}: TreasureChestOverlayProps) {
  const [showEffects, setShowEffects] = useState(false);
  const [lidOpened, setLidOpened] = useState(false);
  const [sparks, setSparks] = useState<SparkParticle[]>([]);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [lightRays, setLightRays] = useState<LightRay[]>([]);

  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chestRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const openChestRef = useRef<HTMLDivElement>(null);
  const closedBodyRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onChestOpenRef = useRef(onChestOpen);
  const onRewardShowRef = useRef(onRewardShow);
  const onOverlayCompleteRef = useRef(onOverlayComplete);
  onChestOpenRef.current = onChestOpen;
  onRewardShowRef.current = onRewardShow;
  onOverlayCompleteRef.current = onOverlayComplete;

  /* ── Particle generators ─────────────────────────────── */

  const generateSparks = useCallback(() => {
    const newSparks: SparkParticle[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const distance = 50 + Math.random() * 70;
      newSparks.push({
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 0.15,
      });
    }
    setSparks(newSparks);
  }, []);

  const generateFloatingParticles = useCallback(() => {
    const newParticles: FloatingParticle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: (Math.random() - 0.5) * 300,
        size: 1 + Math.random() * 4,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        riseHeight: 100 + Math.random() * 80,
      });
    }
    setFloatingParticles(newParticles);
  }, []);

  const generateLightRays = useCallback(() => {
    const rays: LightRay[] = [];
    for (let i = 0; i < 12; i++) {
      rays.push({
        id: i,
        angle: (360 / 12) * i + Math.random() * 15,
        length: 120 + Math.random() * 80,
        delay: Math.random() * 0.4,
      });
    }
    setLightRays(rays);
  }, []);

  /* ── Single GSAP master timeline (runs once on mount) ── */

  useEffect(() => {
    // Background and content visible from frame 1 — no transparent window
    gsap.set(bgRef.current, { opacity: 1 });
    gsap.set(contentRef.current, { opacity: 1 });
    gsap.set(chestRef.current, { scale: 0.9, y: 15 });

    // Lid starts closed (rotateX: 0), hinge at bottom edge
    gsap.set(lidRef.current, {
      rotateX: 0,
      transformOrigin: "50% 100%",
      transformPerspective: 800,
    });

    // Open chest hidden underneath, closed body visible, glow hidden
    gsap.set(openChestRef.current, { opacity: 0 });
    gsap.set(closedBodyRef.current, { opacity: 1 });
    gsap.set(glowRef.current, { opacity: 0, scale: 0.3 });

    const tl = gsap.timeline();

    // 0.0s → Chest scale entrance (0.5s)
    tl.to(chestRef.current, {
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // 0.5s – 2.5s → Closed chest idle (2s, Framer Motion handles float)

    // 2.5s → Begin opening: fade in open chest underneath, fade out closed body
    tl.to(openChestRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    }, 2.5);
    tl.to(closedBodyRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    }, 2.5);

    // 2.5s → Lid physically opens (1.2s) — 3D rotation around hinge
    tl.to(lidRef.current, {
      rotateX: -120,
      duration: 1.2,
      ease: "power3.inOut",
      transformOrigin: "50% 100%",
      transformPerspective: 800,
    }, 2.5);

    // 2.8s → Golden light from inside
    tl.to(glowRef.current, {
      opacity: 1,
      scale: 1.3,
      duration: 0.8,
      ease: "power2.out",
    }, 2.8);

    // 3.0s → Particles + rays
    tl.call(() => {
      setShowEffects(true);
      generateSparks();
      generateFloatingParticles();
      generateLightRays();
    }, [], 3.0);

    // 3.7s → Lid fully open — notify parent
    tl.call(() => {
      setLidOpened(true);
      onChestOpenRef.current();
    }, [], 3.7);

    // 3.7s – 5.7s → Chest stays open (2s pause)

    // 5.7s → Tell parent to render reward section
    tl.call(() => {
      onRewardShowRef.current();
    }, [], 5.7);

    // 5.7s → Fade background out (1.0s) — reveals reward section behind
    tl.to(bgRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut",
    }, 5.7);

    // 6.7s → Fade chest + effects out (0.6s)
    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    }, 6.7);

    // 7.3s → Tell parent to unmount overlay
    tl.call(() => {
      onOverlayCompleteRef.current();
    }, [], 7.3);

    return () => {
      tl.kill();
    };
  }, [generateSparks, generateFloatingParticles, generateLightRays]);

  /* ── Continuous particle regeneration ───────────────── */

  useEffect(() => {
    if (!showEffects) return;
    const interval = setInterval(() => {
      generateFloatingParticles();
    }, 5000);
    return () => clearInterval(interval);
  }, [showEffects, generateFloatingParticles]);

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center">
      {/* Background layer — GSAP controls opacity independently */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(4,10,20,1) 0%, rgba(2,6,12,1) 70%)",
        }}
      />

      {/* Content layer — chest + effects, GSAP controls opacity independently */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center">
        {/* Chest container — GSAP controls scale/y, perspective for 3D lid */}
        <div ref={chestRef} className="will-change-transform" style={{ perspective: 1000 }}>
          <motion.div
            className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px]"
            animate={
              lidOpened
                ? { y: 0, scale: 1 }
                : { y: [0, -8, 0], scale: [1, 1.02, 1] }
            }
            transition={
              lidOpened
                ? { duration: 0.3 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {/* Idle glow (closed phase) — behind everything */}
            {!lidOpened && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none rounded-full"
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "70%",
                  height: "70%",
                  background:
                    "radial-gradient(circle, rgba(201,168,76,0.35) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
            )}

            {/* Shadow underneath */}
            <motion.div
              className="absolute bottom-[5%] left-1/2 -translate-x-1/2 rounded-full bg-black/60 blur-md pointer-events-none z-[1]"
              animate={{
                width: lidOpened ? "40%" : ["55%", "48%", "55%"],
                opacity: lidOpened ? 0.3 : [0.5, 0.35, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: lidOpened ? 0 : Infinity,
                ease: "easeInOut",
              }}
              style={{ height: "8%" }}
            />

            {/* Open chest (underneath, hidden initially, revealed as lid opens) */}
            <div ref={openChestRef} className="absolute inset-0 z-[2]">
              <Image
                src={OPEN_CHEST}
                alt="Open Treasure Chest"
                fill
                className="object-contain drop-shadow-[0_10px_30px_rgba(201,168,76,0.4)]"
                sizes="(max-width: 768px) 300px, 600px"
              />
            </div>

            {/* Golden glow from inside chest (hidden initially) */}
            <div
              ref={glowRef}
              className="absolute top-[25%] left-1/2 -translate-x-1/2 z-[3] pointer-events-none"
              style={{
                width: "60%",
                height: "40%",
                background:
                  "radial-gradient(ellipse at center, rgba(255,220,100,0.9) 0%, rgba(201,168,76,0.5) 30%, transparent 70%)",
                filter: "blur(12px)",
              }}
            />

            {/* Closed chest body (bottom portion, stays fixed then fades out) */}
            <div
              ref={closedBodyRef}
              className="absolute inset-0 z-[4]"
              style={{ clipPath: `inset(${LID_SPLIT}% 0 0 0)` }}
            >
              <Image
                src={CLOSED_CHEST}
                alt="Closed Treasure Chest Body"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                sizes="(max-width: 768px) 300px, 600px"
                priority
              />
            </div>

            {/* Closed chest lid (top portion, 3D rotation around hinge) */}
            <div
              ref={lidRef}
              className="absolute inset-0 z-[5]"
              style={{
                clipPath: `inset(0 0 ${100 - LID_SPLIT}% 0)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "visible",
              }}
            >
              <Image
                src={CLOSED_CHEST}
                alt="Closed Treasure Chest Lid"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                sizes="(max-width: 768px) 300px, 600px"
                priority
              />
            </div>

            {/* Effects layer — only after chest opens */}
            {showEffects && (
              <div className="absolute inset-0 pointer-events-none z-[6]">
                {/* Light rays */}
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2">
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
                      animate={{ opacity: [0, 0.7, 0.4, 0.6], scaleY: [0, 1, 0.9, 1] }}
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

                {/* Spark burst */}
                <div className="absolute top-[38%] left-1/2 z-40">
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
                      transition={{ duration: 0.8, delay: spark.delay, ease: "easeOut" }}
                    />
                  ))}
                </div>

                {/* Floating particles */}
                <div className="absolute top-[25%] left-1/2 -translate-x-1/2 z-20">
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
