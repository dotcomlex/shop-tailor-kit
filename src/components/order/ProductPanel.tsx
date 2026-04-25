const HERO_IMG =
  "https://cdn.shopify.com/s/files/1/0843/7143/9902/files/vitalwalk_color_2_compressed.jpg?v=1767493057&width=400";

export function ProductPanel() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center justify-between gap-3 text-[12px]">
          <span className="text-[hsl(var(--text-mute))]">21,734+ Happy Customers</span>
          <span className="font-bold text-save">New 2025 Release</span>
        </div>
        <h1 className="text-[22px] font-bold leading-tight text-[hsl(var(--text-strong))] sm:text-[26px]">
          The Original VitalWalk® Shoes
        </h1>
      </div>
      <img
        src={HERO_IMG}
        alt="VitalWalk® Adjustable Comfort Shoes"
        className="h-28 w-28 shrink-0 rounded-md object-cover sm:h-[140px] sm:w-[140px]"
        loading="eager"
      />
    </div>
  );
}
