import { Check } from "lucide-react";
import { WHO_ITS_FOR } from "@/data/features";

export function ConditionsList() {
  return (
    <section className="bg-ink text-paper">
      <div className="container-page py-20 lg:py-24">
        <div className="container-narrow text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand">Who They're For</p>
          <h2 className="font-display text-balance text-4xl font-semibold leading-[1.1] text-paper md:text-5xl">
            Designed for the conditions <em className="not-italic italic text-brand">no other shoe respects</em>
          </h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          {WHO_ITS_FOR.map(({ condition, note }) => (
            <li
              key={condition}
              className="flex items-start gap-3 rounded-2xl border border-paper/12 bg-paper/5 p-4 backdrop-blur-sm"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-paper">{condition}</p>
                <p className="mt-0.5 text-sm text-paper/70">{note}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-xl text-center text-base text-paper/80 md:text-lg">
          If walking has become a daily battle,{" "}
          <span className="font-semibold text-paper">these shoes were made for you.</span>
        </p>
      </div>
    </section>
  );
}
