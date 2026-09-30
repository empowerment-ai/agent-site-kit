import { formatTime, type Hours } from "@/lib/content";

export function HoursTable({ hours, compact = false }: { hours: Hours[]; compact?: boolean }) {
  return (
    <dl className={`grid grid-cols-[auto_1fr] gap-x-8 ${compact ? "gap-y-1 text-sm" : "gap-y-2.5"}`}>
      {hours.map((h) => (
        <div key={h.day} className="contents">
          <dt className="opacity-75">{compact ? h.day.slice(0, 3) : h.day}</dt>
          <dd className="text-right tabular-nums">
            {h.closed || !h.open || !h.close ? (
              <span className="opacity-60">Closed</span>
            ) : (
              `${formatTime(h.open)} – ${formatTime(h.close)}`
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
