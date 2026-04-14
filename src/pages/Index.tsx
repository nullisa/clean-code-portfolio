import HeroSection from "@/components/HeroSection";
import TechStackSection from "@/components/TechStackSection";
import TimelineSection from "@/components/TimelineSection";
import PortfolioSection from "@/components/PortfolioSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TechStackSection />
      <TimelineSection />
      <PortfolioSection />
      <Footer />
    </main>
  );
};

export default Index;
