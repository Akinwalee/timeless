import Navbar from "@/components/timeless/Navbar";
import Hero from "@/components/timeless/Hero";
import BrandStory from "@/components/timeless/BrandStory";
import FirstDrop from "@/components/timeless/FirstDrop";
import Benefits from "@/components/timeless/Benefits";
import WaitlistSection from "@/components/timeless/WaitlistSection";
import Footer from "@/components/timeless/Footer";
import MobileStickyBar from "@/components/timeless/MobileStickyBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <BrandStory />
        <FirstDrop />
        <Benefits />
        <WaitlistSection />
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}
