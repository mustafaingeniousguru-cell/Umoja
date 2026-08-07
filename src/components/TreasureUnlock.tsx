"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";

/* ── Types ──────────────────────────────────────────────── */

type TreasureUnlockProps = {
  onUnlock: () => void;
};

interface TrailParticle {
  id: number;
  x: number;
  y: number;
}

/* ── Component ──────────────────────────────────────────── */

export default function TreasureUnlock({ onUnlock }: TreasureUnlockProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [trailParticles, setTrailParticles] = useState<TrailParticle[]>([]);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const unlockFxRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;

  /* Drag motion values */
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  /* Spring-smoothed drag for smooth feel */
  const springX = useSpring(dragX, { stiffness: 300, damping: 30 });
  const springY = useSpring(dragY, { stiffness: 300, damping: 30 });

  /* 3D tilt based on drag position */
  const rotateY = useTransform(springX, [-200, 200], [15, -15]);
  const rotateX = useTransform(springY, [-100, 100], [-10, 10]);

  /* Target glow intensity based on proximity */
  const targetGlow = useTransform(springX, [0, 200], [0.3, 1]);
  const targetScale = useTransform(springX, [0, 200], [1, 1.15]);

  /* Progress 0 → 1 as seal moves toward target */
  const progressMotion = useTransform(springX, [0, 200], [0, 1]);
  const progressWidth = useTransform(progressMotion, (v) => `${v * 100}%`);

  /* ── Trail particles while dragging ──────────────────── */

  useEffect(() => {
    const unsubscribe = dragX.on("change", (x) => {
      const y = dragY.get();
      setTrailParticles((prev) => {
        const next = [...prev, { id: particleIdRef.current++, x, y }];
        return next.slice(-15);
      });
    });
    return () => unsubscribe();
  }, [dragX, dragY]);

  /* Clean up old trail particles */
  useEffect(() => {
    if (trailParticles.length === 0) return;
    const timer = setTimeout(() => {
      setTrailParticles((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [trailParticles]);

  /* Track progress value */
  useEffect(() => {
    const unsubscribe = progressMotion.on("change", (v) => {
      setProgress(v);
    });
    return () => unsubscribe();
  }, [progressMotion]);

  /* ── Cleanup GSAP timeline on unmount ────────────────── */

  useEffect(() => {
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  /* ── Drag end: check if seal reached target ──────────── */

  const handleDragEnd = useCallback(
    () => {
      const container = containerRef.current;
      const target = targetRef.current;
      if (!container || !target) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const targetCenterX = targetRect.left + targetRect.width / 2 - containerRect.left;
      const targetCenterY = targetRect.top + targetRect.height / 2 - containerRect.top;

      const sealX = dragX.get() + 75; // seal center offset
      const sealY = dragY.get() + 75;

      const dist = Math.hypot(targetCenterX - sealX, targetCenterY - sealY);

      if (dist < 80) {
        /* ── SUCCESS: seal reached target ── */
        setUnlocking(true);

        /* Snap seal to target center */
        const snapX = targetCenterX - 75;
        const snapY = targetCenterY - 75;

        /* Play unlock animation with GSAP */
        const tl = gsap.timeline();
        tlRef.current = tl;

        /* Snap seal into position via proxy */
        const dragProxy = { x: dragX.get(), y: dragY.get() };
        tl.to(dragProxy, {
          x: snapX,
          y: snapY,
          duration: 0.3,
          ease: "back.out(1.4)",
          onUpdate: () => {
            dragX.set(dragProxy.x);
            dragY.set(dragProxy.y);
          },
        }, 0);

        /* Impact: scale pulse on seal */
        tl.to(sealRef.current, {
          scale: 1.2,
          duration: 0.15,
          ease: "power2.out",
        }, 0.3);
        tl.to(sealRef.current, {
          scale: 0,
          rotate: 720,
          duration: 0.6,
          ease: "power3.in",
        }, 0.5);

        /* Target glow burst */
        tl.to(targetRef.current, {
          scale: 2.5,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        }, 0.5);

        /* Golden light expand */
        tl.fromTo(unlockFxRef.current, {
          scale: 0,
          opacity: 0,
        }, {
          scale: 3,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        }, 0.5);
        tl.to(unlockFxRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        }, 1.0);

        /* After animation, trigger unlock */
        tl.call(() => {
          setUnlocked(true);
          onUnlockRef.current();
        }, [], 1.3);
      } else {
        /* ── FAIL: spring back to start ── */
        dragX.set(0);
        dragY.set(0);
      }
    },
    [dragX, dragY]
  );

  /* ── Render ──────────────────────────────────────────── */

  return (
    <motion.div
      key="treasure-unlock"
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.4, ease: "easeInOut" } }}
      className="flex flex-col items-center w-full"
    >
      {/* Heading */}
      <div className="text-center z-20 relative mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-5xl md:text-7xl font-black text-[#c9a84c] uppercase tracking-widest drop-shadow-[0_0_15px_rgba(201,168,76,0.4)]">
          Treasure Box
        </h2>
        <p className="mt-2 sm:mt-4 text-xs sm:text-base text-white/60 uppercase tracking-[0.3em] font-semibold">
          Unlock Today&apos;s Treasure
        </p>
      </div>

      {/* 3D Interaction Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[500px] mx-auto"
        style={{ perspective: 1200 }}
      >
        {/* Premium card backdrop */}
        <div
          className="relative rounded-[1.5rem] sm:rounded-[2rem] border-2 border-[#c9a84c]/30 overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, rgba(10,26,46,0.9) 0%, rgba(4,10,20,0.95) 50%, rgba(8,20,36,0.9) 100%)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Inner ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)",
            }}
          />

          {/* Progress bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#ffd700]"
              style={{ width: progressWidth }}
            />
          </div>

          {/* Interaction area */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 px-6 sm:px-12 py-12 sm:py-16 min-h-[280px] sm:min-h-[220px]">

            {/* ── Golden Treasure Seal (draggable) ── */}
            {!unlocked && (
              <motion.div
                ref={sealRef}
                drag={!unlocking}
                dragConstraints={{ left: 0, top: 0, right: 200, bottom: 0 }}
                dragElastic={0.2}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{
                  x: springX,
                  y: springY,
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  cursor: unlocking ? "default" : "grab",
                }}
                whileTap={{ cursor: "grabbing", scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className="relative shrink-0 z-30"
              >
                {/* Floating animation wrapper */}
                <motion.div
                  animate={
                    unlocking
                      ? { y: 0 }
                      : { y: [0, -6, 0], rotate: [0, 2, -2, 0] }
                  }
                  transition={
                    unlocking
                      ? { duration: 0.3 }
                      : { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }
                  className="relative"
                >
                  {/* Seal glow */}
                  <div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(201,168,76,0.5) 0%, transparent 70%)",
                      transform: "scale(1.5)",
                    }}
                  />

                  {/* 3D Seal body */}
                  <div
                    className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 30%, #ffe580 0%, #d4a836 40%, #a07820 70%, #8b6b1a 100%)",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.5), inset 0 3px 6px rgba(255,235,150,0.4), inset 0 -4px 8px rgba(80,50,10,0.5), 0 0 20px rgba(201,168,76,0.3)",
                      border: "3px solid rgba(255,220,120,0.3)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Inner ring */}
                    <div
                      className="absolute inset-[12%] rounded-full border-2"
                      style={{
                        borderColor: "rgba(80,50,10,0.4)",
                        boxShadow: "inset 0 2px 4px rgba(255,235,150,0.2)",
                      }}
                    />

                    {/* Center emblem */}
                    <div
                      className="relative z-10 flex flex-col items-center justify-center"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {/* Diamond/gem shape */}
                      <div
                        className="w-7 h-7 sm:w-9 sm:h-9 mb-1"
                        style={{
                          background:
                            "linear-gradient(135deg, #fff5cc 0%, #d4a836 50%, #8b6b1a 100%)",
                          clipPath:
                            "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                        }}
                      />
                      <span className="text-[7px] sm:text-[9px] font-black text-[#3a2810] uppercase tracking-wider">
                        Unlock
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* "DRAG TO UNLOCK" label below seal */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[10px] sm:text-xs font-black text-[#c9a84c] uppercase tracking-[0.25em] drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]"
                  >
                    Drag to Unlock
                  </motion.span>
                </div>
              </motion.div>
            )}

            {/* ── Trail particles ── */}
            <AnimatePresence>
              {trailParticles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute w-2 h-2 rounded-full pointer-events-none z-20"
                  style={{
                    left: 75 + p.x,
                    top: 75 + p.y,
                    background:
                      "radial-gradient(circle, rgba(255,215,100,0.9) 0%, rgba(201,168,76,0.4) 50%, transparent 100%)",
                    boxShadow: "0 0 6px rgba(255,215,0,0.6)",
                  }}
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>

            {/* ── Arrow indicator (desktop) ── */}
            {!unlocked && (
              <motion.div
                className="hidden sm:flex items-center gap-2 z-10"
                animate={{ x: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#c9a84c]/40"
                    style={{ marginLeft: `${i * 4}px` }}
                  />
                ))}
              </motion.div>
            )}

            {/* ── Unlock Target ── */}
            {!unlocked && (
              <motion.div
                ref={targetRef}
                className="relative shrink-0 z-10"
                style={{
                  opacity: targetGlow,
                  scale: targetScale,
                }}
              >
                {/* Target glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-md"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background:
                      progress > 0.5
                        ? "radial-gradient(circle, rgba(255,215,100,0.6) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
                    transform: "scale(1.8)",
                  }}
                />

                {/* Target ring */}
                <div
                  className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full border-3 flex items-center justify-center"
                  style={{
                    borderWidth: "3px",
                    borderColor:
                      progress > 0.7
                        ? "rgba(255,215,100,0.8)"
                        : progress > 0.3
                        ? "rgba(201,168,76,0.6)"
                        : "rgba(201,168,76,0.3)",
                    borderStyle: "dashed",
                    background:
                      progress > 0.5
                        ? "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)"
                        : "transparent",
                    boxShadow:
                      progress > 0.7
                        ? "0 0 30px rgba(255,215,100,0.4), inset 0 0 20px rgba(201,168,76,0.2)"
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Lock icon */}
                  <div
                    className="flex flex-col items-center"
                    style={{ opacity: 1 - progress * 0.5 }}
                  >
                    {/* Lock body */}
                    <div
                      className="w-6 h-5 sm:w-8 sm:h-6 rounded-sm relative"
                      style={{
                        background:
                          "linear-gradient(180deg, #c9a84c 0%, #8b6b1a 100%)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Keyhole */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#040a14]" />
                    </div>
                    {/* Lock shackle */}
                    <div
                      className="w-4 h-3 sm:w-5 sm:h-4 border-t-2 border-l-2 border-r-2 rounded-t-full -mb-1"
                      style={{
                        borderColor: "#c9a84c",
                        borderBottom: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Target label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[9px] sm:text-[10px] font-black text-[#c9a84c]/60 uppercase tracking-[0.2em]">
                    Unlock
                  </span>
                </div>
              </motion.div>
            )}

            {/* ── Unlock success flash effect ── */}
            <div
              ref={unlockFxRef}
              className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[100px] h-[100px] rounded-full pointer-events-none z-40 opacity-0"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,220,100,0.9) 0%, rgba(201,168,76,0.5) 30%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          </div>

          {/* Bottom instruction hint */}
          {!unlocked && (
            <div className="pb-6 text-center">
              <motion.p
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.2em] font-semibold"
              >
                Drag the golden seal to the lock
              </motion.p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
