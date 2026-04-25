// Press strip removed — we don't have real press placements and avif logos render inconsistently.
import { SiteHeader } from "@/components/funnel/SiteHeader";
import { Hero } from "@/components/funnel/Hero";
import { PressStrip } from "@/components/funnel/PressStrip";
import { ProblemBlock } from "@/components/funnel/ProblemBlock";
import { PivotBlock } from "@/components/funnel/PivotBlock";
import { FeatureRows } from "@/components/funnel/FeatureRows";
import { BenefitGifGrid } from "@/components/funnel/BenefitGifGrid";
import { PodiatristBlock } from "@/components/funnel/PodiatristBlock";
import { SocialProofCards } from "@/components/funnel/SocialProofCards";
import { ConditionsList } from "@/components/funnel/ConditionsList";
import { GuaranteeBlock } from "@/components/funnel/GuaranteeBlock";
import { ReviewWall } from "@/components/funnel/ReviewWall";
import { FaqSection } from "@/components/funnel/FaqSection";
import { FinalCta } from "@/components/funnel/FinalCta";
import { SiteFooter } from "@/components/funnel/SiteFooter";
import { StickyMobileCta } from "@/components/funnel/StickyMobileCta";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <PressStrip />
        <ProblemBlock />
        <PivotBlock />
        <FeatureRows />
        <BenefitGifGrid />
        <PodiatristBlock />
        <SocialProofCards />
        <ConditionsList />
        <GuaranteeBlock />
        <ReviewWall />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyMobileCta />
    </div>
  );
};

export default Index;
