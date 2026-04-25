import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SizeSelectProps {
  sizes: string[];
  value: string | null;
  onChange: (value: string) => void;
  disabledSizes?: Set<string>;
}

export function SizeSelect({ sizes, value, onChange, disabledSizes }: SizeSelectProps) {
  return (
    <Select value={value ?? undefined} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full border-2 border-border bg-background text-[14px] font-medium">
        <SelectValue placeholder="Select Your Size" />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {sizes.map((s) => (
          <SelectItem key={s} value={s} disabled={disabledSizes?.has(s)}>
            {s}
            {disabledSizes?.has(s) && <span className="ml-2 text-[hsl(var(--text-mute))]">(out of stock)</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
