import { Check } from "lucide-react";
import { useGeo } from "@/hooks/useGeo";

interface IncludedChecklistProps {
  /** Selected bundle quantity — controls free vs paid shipping copy. */
  quantity?: number;
}

export function IncludedChecklist({ quantity = 1 }: IncludedChecklistProps) {
  const { country } = useGeo();
  const shipsFree = quantity > 1;
  const dest = country?.name ?? "your door";

  // Match Shopify's actual configured shipping behavior so the funnel never
  // promises something checkout won't honor. Splits the trailing word so we
  // can wrap it together with the country flag in a non-breaking span — keeps
  // the flag from orphaning onto its own line on narrow viewports.
  const head = shipsFree
    ? `Fast & free shipping to `
    : `Fast shipping to ${dest} · free on 2+ `;
  const tail = shipsFree ? dest : "pairs";

  return (
    <ul className="space-y-2 rounded-lg border border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5">
      <li className="flex items-center gap-2.5 text-[12.5px] text-[hsl(var(--text-body))] sm:text-[13.5px]">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-verified text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
        </span>
        <span className="font-semibold">
          {head}
          <span className="whitespace-nowrap">
            {tail}
            {country?.flag && <>{"\u00A0"}<span aria-hidden>{country.flag}</span></>}
          </span>
        </span>
      </li>
      <li className="flex items-center gap-2.5 text-[12.5px] text-[hsl(var(--text-body))] sm:text-[13.5px]">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-verified text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
        </span>
        <span className="font-semibold">Easy returns &amp; exchanges</span>
      </li>
    </ul>
  );
}
