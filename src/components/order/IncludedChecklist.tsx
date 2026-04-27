import { Check } from "lucide-react";
import { useGeo } from "@/hooks/useGeo";

export function IncludedChecklist() {
  const { country } = useGeo();
  const shippingLine = country?.name
    ? `Fast & free shipping to ${country.name}`
    : "Fast & free worldwide shipping";

  const items = [shippingLine, "Easy returns & exchanges"];

  return (
    <ul className="space-y-2 rounded-lg border border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2.5 text-[13px] text-[hsl(var(--text-body))] sm:text-[13.5px]"
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-verified text-white">
            <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
          </span>
          <span className="font-semibold">{item}</span>
        </li>
      ))}
    </ul>
  );
}
