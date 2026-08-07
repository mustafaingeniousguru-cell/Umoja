"use client";

import TreasureScrollExperience from "../components/TreasureScrollExperience";

export default function TreasureBox() {
  return (
    <section
      id="treasure"
      className="relative w-full border-y-[4px] border-[#c9a84c]/20 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050b16 0%, #0a1a2e 40%, #061224 100%)',
      }}
    >
      <TreasureScrollExperience />
    </section>
  );
}
