export function ColorKey() {
  return (
    <div className="rounded-md border border-border/60 bg-muted/40 p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Color key
      </p>

      <ul className="mt-2 space-y-1.5 text-xs">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#A45F76]" />
          In bloom
        </li>

        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#B96332]" />
          Fruit / berries
        </li>

        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#496B50]" />
          Foliage interest
        </li>

        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7E8782]" />
          Quiet / dormant
        </li>
      </ul>
    </div>
  );
}