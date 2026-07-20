import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeatureAnalyze } from "@/components/landing/feature-analyze";
import { FeatureOutreachDiff } from "@/components/landing/feature-outreach-diff";
import { FeatureWorkflowBento } from "@/components/landing/feature-workflow-bento";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { ProductDemoSection } from "@/components/landing/product-demo-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { StatsSection } from "@/components/landing/stats-section";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProductDemoSection />
        <FeatureAnalyze />
        <FeatureOutreachDiff />
        <FeatureWorkflowBento />
        <StatsSection />
        <HowItWorks />
        <Testimonials />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
