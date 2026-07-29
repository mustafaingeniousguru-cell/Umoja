import Header from "@/components/layout/Header";
import Hero from "@/sections/Hero";
import TreasureBox from "@/sections/TreasureBox";
import NewArrivals from "@/sections/NewArrivals";
import Categories from "@/sections/Categories";
import TreasureChest from "@/sections/TreasureChest";
import HowItWorks from "@/sections/HowItWorks";
import Newsletter from "@/sections/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen text-white overflow-x-hidden relative selection:bg-[#c9a84c]/30 selection:text-white bg-[#040a14]">
      <Header />
      <main className="flex flex-col">
        <Hero />
        <TreasureBox />
        <NewArrivals />
        <Categories />
        <TreasureChest />
        <HowItWorks />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
