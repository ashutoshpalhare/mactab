import { useEffect, useState } from "react";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Snowflake, Sun } from "lucide-react";
import { useWeather, weatherIcon } from "../hooks/useWeather";

/** Live clock icon — analog dial with real time (updates every second). */
export function DynamicClockIcon({ size = 32 }: { size?: number }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hourDeg = h * 30 + m * 0.5;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow">
      <defs>
        <radialGradient id="clockFace" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#clockFace)" stroke="#111827" strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x="49"
          y="6"
          width="2"
          height={i % 3 === 0 ? 8 : 5}
          fill="#111827"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <line x1="50" y1="50" x2="50" y2="24" stroke="#111827" strokeWidth="4" strokeLinecap="round" transform={`rotate(${hourDeg} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="14" stroke="#111827" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minDeg} 50 50)`} />
      <line x1="50" y1="55" x2="50" y2="10" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${secDeg} 50 50)`} />
      <circle cx="50" cy="50" r="3" fill="#111827" />
      <circle cx="50" cy="50" r="1.5" fill="#ef4444" />
    </svg>
  );
}

const W_ICONS = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-rain": CloudRain,
  snowflake: Snowflake,
  "cloud-lightning": CloudLightning,
} as const;

/** Live weather icon reflecting current condition and temperature. */
export function DynamicWeatherIcon({ size = 32 }: { size?: number }) {
  const w = useWeather();
  const Icon = W_ICONS[weatherIcon(w.current.code) as keyof typeof W_ICONS] ?? Cloud;
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <Icon style={{ width: size * 0.78, height: size * 0.78 }} className="text-white drop-shadow" />
      {!w.loading && (
        <span className="absolute -bottom-0.5 right-0 text-[9px] font-semibold text-white/95 bg-black/30 rounded-full px-1 leading-tight backdrop-blur-sm">
          {w.current.temp}°
        </span>
      )}
    </div>
  );
}
