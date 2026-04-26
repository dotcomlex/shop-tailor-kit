import { Sparkles, Truck } from "lucide-react";
import { useGeo } from "@/hooks/useGeo";

interface SavingsHeroProps {
  saved: number;
  comparePrice: number;
}

export function SavingsHero({ saved, comparePrice }: SavingsHeroProps) {
  const { country } = useGeo();

  const shippingLine = country
    ? `FREE & fast shipping to ${country.flag} ${country.name}`
    : "FREE worldwide shipping included";

  return (
    <div className="overflow-hidden rounded-xl border border-verified/30 bg-[hsl(var(--verified-green)/0.08)]">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verified text-white">
          <Sparkles className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold leading-tight tracking-tight text-[hsl(var(--text-strong))] sm:text-[16px]">
            You're saving ${saved.toFixed(2)} today
          </p>
          <p className="mt-0.5 text-[12.5px] text-[hsl(var(--text-body))]">
            vs ${comparePrice.toFixed(2)} retail price
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-verified/25 bg-verified/5 px-4 py-2.5 sm:px-5">
        <Truck className="h-4 w-4 shrink-0 text-verified" strokeWidth={2.5} />
        <p className="text-[12.5px] font-bold tracking-tight text-[hsl(var(--text-strong))] sm:text-[13.5px]">
          {shippingLine}
        </p>
      </div>
    </div>
  );
}
