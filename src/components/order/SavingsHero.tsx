import { Sparkles } from "lucide-react";

interface SavingsHeroProps {
  saved: number;
  comparePrice: number;
}

export function SavingsHero({ saved, comparePrice }: SavingsHeroProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-verified/30 bg-[hsl(var(--verified-green)/0.08)] px-4 py-3 sm:px-5 sm:py-4">
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
  );
}
