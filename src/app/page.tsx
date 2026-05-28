import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FeaturedClients from "@/components/FeaturedClients";
import CaseStudies from "@/components/CaseStudies";
import FAQ from "@/components/FAQ";
import Reviews from "@/components/Reviews";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedClients />
      <CaseStudies />
      <FAQ />
      <Reviews />
    </>
  );
}
