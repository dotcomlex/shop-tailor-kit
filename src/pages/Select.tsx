import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/funnel/SiteHeader";
import { AnnouncementBar } from "@/components/funnel/AnnouncementBar";

const Select = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <SiteHeader />
      <main className="container-page py-20 lg:py-28">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="micro-label mb-4 text-brand">Step 2 of 3</p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Pick Your Size &amp; Color
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            We're putting the finishing touches on this step. Variant selection,
            bundle savings, and checkout handoff land in the next update.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Select;
