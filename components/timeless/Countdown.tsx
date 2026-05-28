"use client";

import { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

const LAUNCH_DATE = new Date("2026-06-01T18:00:00+01:00").getTime();

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function getCountdown() {
  const distance = Math.max(LAUNCH_DATE - Date.now(), 0);
  return {
    days: pad(Math.floor(distance / (1000 * 60 * 60 * 24))),
    hours: pad(Math.floor((distance / (1000 * 60 * 60)) % 24)),
    minutes: pad(Math.floor((distance / (1000 * 60)) % 60)),
    seconds: pad(Math.floor((distance / 1000) % 60)),
  };
}

export default function Countdown() {
  const [time, setTime] = useState(getCountdown);

  useEffect(() => {
    const timer = setInterval(() => setTime(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div
      className="reveal delay-3 mt-14 grid grid-cols-4 border-t border-b border-brand-border max-[920px]:grid-cols-2"
      aria-label="Launch countdown"
    >
      {units.map((unit, i) => (
        <div
          key={unit.label}
          className={`${styles.countItem} px-5 py-6 max-[560px]:px-4 max-[560px]:py-5 ${
            i < 3 ? "border-r border-brand-border" : ""
          }`}
        >
          <span className="block text-[clamp(32px,4vw,58px)] font-black leading-none tracking-[-0.06em]">
            {unit.value}
          </span>
          <span className="mt-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-muted-2">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
