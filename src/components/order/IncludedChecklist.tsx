import { Check } from "lucide-react";
import { useGeo } from "@/hooks/useGeo";

interface IncludedChecklistProps {
  /** Selected bundle quantity — controls free vs paid shipping copy. */
  quantity?: number;
}

export function IncludedChecklist({ quantity = 1 }: IncludedChecklistProps) {
  const { country } = useGeo();
  const dest = country?.name ?? "your door";

  // Free shipping is now universal across every tier — shipping cost is
  // already absorbed into product pricing, so we surface it as a trust
  // signal on every order regardless of quantity.
  const head = `Fast & free shipping to `;
  const tail = dest;

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
