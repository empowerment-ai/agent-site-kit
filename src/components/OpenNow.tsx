"use client";

// Shows "Open now, until 3pm" or "Closed, opens Tue 7am" using the
// business's own time zone, so it's right no matter where the visitor is.
import { useEffect, useState } from "react";
import type { Hours } from "@/lib/content";

function fmt(t: string) {
  const [h, m] = t.split(":").map(Number);
  const s = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hr}:${String(m).padStart(2, "0")}${s}` : `${hr}${s}`;
}

export function openStatus(hours: Hours[], timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const day = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  const time = `${hh}:${mm}`;
  const idx = hours.findIndex((h) => h.day === day);
  const today = hours[idx];
  if (today && !today.closed && today.open && today.close && time >= today.open && time < today.close) {
    return { open: true, label: `Open now, until ${fmt(today.close)}` };
  }
  for (let i = 0; i < 7; i++) {
    const d = hours[(idx + i) % 7];
    if (!d || d.closed || !d.open) continue;
    if (i === 0 && time >= d.open) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : d.day.slice(0, 3);
    return { open: false, label: `Closed, opens ${when} ${fmt(d.open)}` };
  }
  return { open: false, label: "Closed" };
}

export function OpenNow({ hours, timezone }: { hours: Hours[]; timezone: string }) {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    setStatus(openStatus(hours, timezone));
    const t = setInterval(() => setStatus(openStatus(hours, timezone)), 60_000);
    return () => clearInterval(t);
  }, [hours, timezone]);

  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium" aria-live="polite">
      <span
        className={`size-2 rounded-full ${status?.open ? "bg-ember animate-pulse" : "bg-muted/50"}`}
        aria-hidden
      />
      <span className="min-w-[14ch]">{status?.label ?? "Checking hours…"}</span>
    </span>
  );
}
