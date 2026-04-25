import { Truck, ShieldCheck, RefreshCw, Zap } from "lucide-react";

export function AnnouncementBar() {
  const items = [
    { icon: Zap, text: "Flash Sale Ends Tonight" },
    { icon: ShieldCheck, text: "60-Day Money-Back Guarantee" },
    { icon: Truck, text: "Free US Shipping" },
    { icon: RefreshCw, text: "Easy Returns" },
  ];
  // Duplicate for seamless marquee on mobile
  const loop = [...items, ...items];

  return (
    <div className="bg-slate-band text-paper">
      {/* Desktop: static centered */}
      <div className="hidden md:flex container-page items-center justify-center gap-10 py-2.5 text-[12px] font-medium uppercase tracking-[0.16em]">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 opacity-90">
            <Icon className="h-3.5 w-3.5 text-brand" strokeWidth={2.2} />
            {text}
          </div>
        ))}
      </div>
      {/* Mobile: marquee */}
      <div className="md:hidden overflow-hidden py-2.5">
        <div className="flex w-max animate-marquee gap-8 text-[11px] font-medium uppercase tracking-[0.16em]">
          {loop.map(({ icon: Icon, text }, i) => (
            <div key={`${text}-${i}`} className="flex shrink-0 items-center gap-2 opacity-90">
              <Icon className="h-3.5 w-3.5 text-brand" strokeWidth={2.2} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
