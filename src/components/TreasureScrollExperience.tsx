"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TreasureRewardSection from "./TreasureRewardSection";

/* ── Register ScrollTrigger ─────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ── Image path ─────────────────────────────────────────── */

/* Closed chest PNG — split into body + lid layers */
const CHEST_IMG = "/amoja_treasure2-01.png";
/* Open chest PNG — used ONLY for the interior/treasure portion (clipped) */
const OPEN_CHEST = "/amoja_treasure-01.png";

/* Lid split — top 38% is the lid, bottom 62% is the body */
const LID_SPLIT = 38;
/* Treasure clip — show ONLY the treasure objects from the open PNG.
   Top ~20% is the open lid (skip), bottom ~40% is the chest frame (skip).
   The remaining middle band contains diamonds, coins, statue, etc.
   Side clips avoid any chest frame edges bleeding through. */
const TREASURE_CLIP_TOP = 22;
const TREASURE_CLIP_BOTTOM = 42;
const TREASURE_CLIP_SIDE = 8;

/* ── Particle config type ───────────────────────────────── */

interface ParticleConfig {
  x: number;
  size: number;
  riseHeight: number;
  duration: number;
  delay: number;
}

/* ── Component ──────────────────────────────────────────── */

export default function TreasureScrollExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const chestContainerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const treasureRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const rewardRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const treasureHeadingRef = useRef<HTMLDivElement>(null);

  /* Particles generated client-side only to avoid hydration mismatch */
  const [particles, setParticles] = useState<ParticleConfig[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 16 }, () => ({
        x: (Math.random() - 0.5) * 280,
        size: 2 + Math.random() * 4,
        riseHeight: 80 + Math.random() * 80,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ── Desktop / tablet ── */
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2400",
            pin: stickyRef.current,
            scrub: 2.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* ── Initial states ── */
        gsap.set(lidRef.current, {
          rotateX: 0,
          transformOrigin: `50% ${LID_SPLIT}%`,
          transformPerspective: 1600,
        });
        gsap.set(bodyRef.current, { opacity: 1 });
        gsap.set(glowRef.current, { opacity: 0, scale: 0.5 });
        gsap.set(treasureRef.current, { opacity: 0 });
        gsap.set(raysRef.current, { opacity: 0 });
        gsap.set(particlesRef.current, { opacity: 0 });
        gsap.set(rewardRef.current, { y: 150, opacity: 0, scale: 0.8 });
        gsap.set(chestContainerRef.current, { scale: 1, y: 0, opacity: 1 });
        gsap.set(bgGlowRef.current, { opacity: 0.2 });
        gsap.set(treasureHeadingRef.current, { opacity: 0, y: 15 });

        /* ── PHASE 1 (0 → 0.15): Closed chest entrance ── */
        tl.fromTo(
          chestContainerRef.current,
          { scale: 0.85, y: 50, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.15, ease: "power2.out" },
          0
        );
        tl.to(bgGlowRef.current, { opacity: 0.35, duration: 0.15, ease: "power2.out" }, 0);

        /* ── PHASE 2 (0.15 → 0.65): Slow hinge rotation ── */
        /* Lid rotates around rear hinge at the BOTTOM of the lid (where it meets body).
           transformOrigin is at LID_SPLIT% — the hinge line.
           Front edge (top of chest) lifts up and back. Hinge stays fixed. */
        tl.to(
          lidRef.current,
          {
            rotateX: -80,
            duration: 0.50,
            ease: "power1.inOut",
            transformOrigin: `50% ${LID_SPLIT}%`,
            transformPerspective: 1600,
          },
          0.15
        );

        /* Treasure contents — revealed as lid opens */
        tl.to(treasureRef.current, { opacity: 0.3, duration: 0.15, ease: "power2.out" }, 0.25);
        tl.to(treasureRef.current, { opacity: 0.7, duration: 0.20, ease: "power2.out" }, 0.40);
        tl.to(treasureRef.current, { opacity: 1, duration: 0.15, ease: "power2.out" }, 0.55);

        /* Golden glow */
        tl.to(glowRef.current, { opacity: 0.3, scale: 0.7, duration: 0.12, ease: "power2.out" }, 0.20);
        tl.to(glowRef.current, { opacity: 0.6, scale: 0.9, duration: 0.20, ease: "power2.out" }, 0.35);
        tl.to(glowRef.current, { opacity: 0.9, scale: 1.1, duration: 0.15, ease: "power2.out" }, 0.55);

        /* Light rays */
        tl.to(raysRef.current, { opacity: 0.35, duration: 0.20, ease: "power2.out" }, 0.30);

        /* Particles */
        tl.to(particlesRef.current, { opacity: 0.6, duration: 0.20, ease: "power2.out" }, 0.30);

        /* Background glow */
        tl.to(bgGlowRef.current, { opacity: 0.5, duration: 0.30, ease: "power2.out" }, 0.25);

        /* ── PHASE 3 (0.65 → 0.75): Fully open, hold ── */
        tl.to(glowRef.current, { opacity: 1, scale: 1.2, duration: 0.10, ease: "power2.out" }, 0.65);

        /* ── PHASE 4 (0.75 → 0.85): Treasure settles ── */
        tl.to(bgGlowRef.current, { opacity: 0.6, duration: 0.10, ease: "power2.out" }, 0.75);

        /* ── PHASE 5 (0.85 → 1.0): TREASURE OF THE DAY + reward ── */
        tl.to(
          chestContainerRef.current,
          { scale: 0.5, y: -120, duration: 0.15, ease: "power2.inOut" },
          0.85
        );
        tl.to(
          treasureHeadingRef.current,
          { opacity: 1, y: 0, duration: 0.10, ease: "power2.out" },
          0.85
        );
        tl.to(
          rewardRef.current,
          { y: 0, opacity: 1, scale: 1, duration: 0.15, ease: "power3.out" },
          0.85
        );
        tl.to(glowRef.current, { opacity: 0.25, scale: 1, duration: 0.15, ease: "power2.inOut" }, 0.85);
        tl.to(raysRef.current, { opacity: 0, duration: 0.10, ease: "power2.inOut" }, 0.85);
        tl.to(particlesRef.current, { opacity: 0, duration: 0.10, ease: "power2.inOut" }, 0.85);
      });

      /* ── Mobile ── */
      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2200",
            pin: stickyRef.current,
            scrub: 2.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* ── Initial states ── */
        gsap.set(lidRef.current, {
          rotateX: 0,
          transformOrigin: `50% ${LID_SPLIT}%`,
          transformPerspective: 1600,
        });
        gsap.set(bodyRef.current, { opacity: 1 });
        gsap.set(glowRef.current, { opacity: 0, scale: 0.5 });
        gsap.set(treasureRef.current, { opacity: 0 });
        gsap.set(raysRef.current, { opacity: 0 });
        gsap.set(particlesRef.current, { opacity: 0 });
        gsap.set(rewardRef.current, { y: 100, opacity: 0, scale: 0.8 });
        gsap.set(chestContainerRef.current, { scale: 1, y: 0, opacity: 1 });
        gsap.set(bgGlowRef.current, { opacity: 0.2 });
        gsap.set(treasureHeadingRef.current, { opacity: 0, y: 15 });

        /* PHASE 1 (0 → 0.15): Entrance */
        tl.fromTo(
          chestContainerRef.current,
          { scale: 0.85, y: 40, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.15, ease: "power2.out" },
          0
        );
        tl.to(bgGlowRef.current, { opacity: 0.35, duration: 0.15, ease: "power2.out" }, 0);

        /* PHASE 2 (0.15 → 0.65): Slow hinge rotation */
        tl.to(
          lidRef.current,
          {
            rotateX: -80,
            duration: 0.50,
            ease: "power1.inOut",
            transformOrigin: `50% ${LID_SPLIT}%`,
            transformPerspective: 1600,
          },
          0.15
        );

        /* Treasure contents — revealed as lid opens */
        tl.to(treasureRef.current, { opacity: 0.3, duration: 0.15, ease: "power2.out" }, 0.25);
        tl.to(treasureRef.current, { opacity: 0.7, duration: 0.20, ease: "power2.out" }, 0.40);
        tl.to(treasureRef.current, { opacity: 1, duration: 0.15, ease: "power2.out" }, 0.55);

        /* Glow */
        tl.to(glowRef.current, { opacity: 0.3, scale: 0.7, duration: 0.12, ease: "power2.out" }, 0.20);
        tl.to(glowRef.current, { opacity: 0.6, scale: 0.9, duration: 0.20, ease: "power2.out" }, 0.35);
        tl.to(glowRef.current, { opacity: 0.9, scale: 1.1, duration: 0.15, ease: "power2.out" }, 0.55);

        /* Rays + particles */
        tl.to(raysRef.current, { opacity: 0.3, duration: 0.20, ease: "power2.out" }, 0.30);
        tl.to(particlesRef.current, { opacity: 0.5, duration: 0.20, ease: "power2.out" }, 0.30);
        tl.to(bgGlowRef.current, { opacity: 0.5, duration: 0.30, ease: "power2.out" }, 0.25);

        /* PHASE 3 (0.65 → 0.75): Hold open */
        tl.to(glowRef.current, { opacity: 1, scale: 1.2, duration: 0.10, ease: "power2.out" }, 0.65);

        /* PHASE 4 (0.75 → 0.85): Treasure settles */
        tl.to(bgGlowRef.current, { opacity: 0.6, duration: 0.10, ease: "power2.out" }, 0.75);

        /* PHASE 5 (0.85 → 1.0): TREASURE OF THE DAY + reward */
        tl.to(chestContainerRef.current, { scale: 0.45, y: -90, duration: 0.15, ease: "power2.inOut" }, 0.85);
        tl.to(treasureHeadingRef.current, { opacity: 1, y: 0, duration: 0.10, ease: "power2.out" }, 0.85);
        tl.to(rewardRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.15, ease: "power3.out" }, 0.85);
        tl.to(glowRef.current, { opacity: 0.25, scale: 1, duration: 0.15, ease: "power2.inOut" }, 0.85);
        tl.to(raysRef.current, { opacity: 0, duration: 0.10, ease: "power2.inOut" }, 0.85);
        tl.to(particlesRef.current, { opacity: 0, duration: 0.10, ease: "power2.inOut" }, 0.85);
      });

      return () => {
        mm.revert();
      };
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div ref={sectionRef} className="relative w-full">
      {/* Sticky / pinned container — stays at 100vh during scroll */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #0a1a2e 0%, #050b16 50%, #040a14 100%)",
        }}
      >
        {/* Background ambient glow */}
        <div
          ref={bgGlowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── ONE CHEST COMPOSITION ── */}
        {/* Container with perspective for 3D lid rotation */}
        <div
          ref={chestContainerRef}
          className="relative z-10 will-change-transform"
          style={{ perspective: 1600 }}
        >
          <div
            className="relative aspect-square w-[80vw] sm:w-[60vw] md:w-[60vw] max-w-[600px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* ── Interior glow (BEHIND treasure + body + lid) ── */}
            {/* CSS radial gradient — invisible when closed, fades in as lid opens */}
            <div
              ref={glowRef}
              className="absolute left-1/2 -translate-x-1/2 z-[1] pointer-events-none"
              style={{
                top: `${LID_SPLIT - 8}%`,
                width: "65%",
                height: "50%",
                background:
                  "radial-gradient(ellipse at center, rgba(255,220,100,0.9) 0%, rgba(201,168,76,0.5) 30%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* ── Treasure contents (from open PNG, clipped to interior only) ── */}
            {/* Uses the open chest PNG but clips to show ONLY the treasure area.
                Not a second chest — only the interior contents are visible.
                z-[2]: behind body (z-3) and lid (z-4), in front of glow (z-1).
                Gradually revealed as lid opens via opacity + translateY. */}
            <div
              ref={treasureRef}
              className="absolute inset-0 z-[2] pointer-events-none"
              style={{
                clipPath: `inset(${TREASURE_CLIP_TOP}% ${TREASURE_CLIP_SIDE}% ${TREASURE_CLIP_BOTTOM}% ${TREASURE_CLIP_SIDE}%)`,
              }}
            >
              <Image
                src={OPEN_CHEST}
                alt="Treasure Contents"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80vw, 60vw"
              />
            </div>

            {/* ── Light rays (behind lid, in front of glow) ── */}
            <div
              ref={raysRef}
              className="absolute left-1/2 -translate-x-1/2 z-[2] pointer-events-none"
              style={{ top: `${LID_SPLIT}%` }}
            >
              {[...Array(8)].map((_, i) => {
                const angle = (360 / 8) * i;
                return (
                  <div
                    key={i}
                    className="absolute origin-bottom"
                    style={{
                      width: "3px",
                      height: "100px",
                      background:
                        "linear-gradient(to top, rgba(255,215,100,0.4) 0%, transparent 100%)",
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: "bottom center",
                      filter: "blur(1px)",
                    }}
                  />
                );
              })}
            </div>

            {/* ── Floating particles (behind lid) ── */}
            <div
              ref={particlesRef}
              className="absolute left-1/2 -translate-x-1/2 z-[2] pointer-events-none"
              style={{ top: `${LID_SPLIT - 5}%` }}
            >
              {particles.map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    left: p.x,
                    bottom: 0,
                    background:
                      "radial-gradient(circle, rgba(255,215,100,0.9) 0%, rgba(201,168,76,0.4) 50%, transparent 100%)",
                    boxShadow: "0 0 4px rgba(255,215,0,0.6)",
                    animation: `treasureParticleRise ${p.duration}s ease-out infinite`,
                    animationDelay: `${p.delay}s`,
                    ["--rise-height" as string]: `${p.riseHeight}px`,
                  }}
                />
              ))}
            </div>

            {/* ── Chest BODY (bottom 62%) ── */}
            {/* ONE closed chest image, clipped to show only the body.
                This NEVER moves. This NEVER fades. It is the fixed body. */}
            <div
              ref={bodyRef}
              className="absolute inset-0 z-[3]"
              style={{ clipPath: `inset(${LID_SPLIT}% 0 0 0)` }}
            >
              <Image
                src={CHEST_IMG}
                alt="Treasure Chest"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                sizes="(max-width: 768px) 80vw, 60vw"
                priority
              />
            </div>

            {/* ── Chest LID (top 38%) ── */}
            {/* SAME closed chest image, clipped to show only the lid.
                This is the ONLY animated layer — rotates backward from top hinge.
                There is only ONE lid. No second lid. No open chest lid. */}
            <div
              ref={lidRef}
              className="absolute inset-0 z-[4]"
              style={{
                clipPath: `inset(0 0 ${100 - LID_SPLIT}% 0)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "visible",
              }}
            >
              <Image
                src={CHEST_IMG}
                alt="Treasure Chest Lid"
                fill
                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                sizes="(max-width: 768px) 80vw, 60vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Reward section — hidden until 85% timeline, then emerges */}
        <div
          ref={rewardRef}
          className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 pb-4 sm:pb-10"
        >
          {/* ── TREASURE OF THE DAY heading ── */}
          {/* Premium metallic gold heading — appears after chest fully opens */}
          <div
            ref={treasureHeadingRef}
            className="mb-4 sm:mb-6 text-center will-change-transform"
          >
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold uppercase tracking-[0.15em] leading-tight"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                background:
                  "linear-gradient(180deg, #f4d97a 0%, #c9a84c 35%, #a07c2a 65%, #d4af5e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter:
                  "drop-shadow(0 2px 6px rgba(201,168,76,0.35)) drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
              }}
            >
              Treasure of the Day
            </h2>
          </div>

          <div className="w-full max-w-[1000px]">
            <TreasureRewardSection />
          </div>
        </div>
      </div>

      {/* Keyframes for particle rise animation */}
      <style jsx global>{`
        @keyframes treasureParticleRise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(var(--rise-height, -100px)) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
