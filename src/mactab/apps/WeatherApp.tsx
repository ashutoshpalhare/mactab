import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Snowflake,
  Sun,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useWeather, weatherIcon, weatherLabel } from "../hooks/useWeather";

const ICONS: Record<string, LucideIcon> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-rain": CloudRain,
  snowflake: Snowflake,
  "cloud-lightning": CloudLightning,
};

const codeIcon = (c: number) => ICONS[weatherIcon(c)] ?? Cloud;

export default function WeatherApp() {
  const w = useWeather();
  const today = w.daily[0];
  const maxHi = Math.max(...w.daily.map((d) => d.hi), 1);
  const minLo = Math.min(...w.daily.map((d) => d.lo), 0);
  const range = Math.max(maxHi - minLo, 1);

  return (
    <div
      className="h-full overflow-auto p-6 text-white"
      style={{ background: "linear-gradient(180deg,#3b82f6 0%,#8b5cf6 100%)" }}
    >
      <div className="text-center mb-6">
        <div className="text-xl opacity-90">{w.location}</div>
        <div className="text-7xl font-thin mt-2">
          {w.loading ? "—" : `${w.current.temp}°`}
        </div>
        <div className="opacity-90">{weatherLabel(w.current.code)}</div>
        {today && (
          <div className="text-sm opacity-80">
            H:{today.hi}° L:{today.lo}°
          </div>
        )}
      </div>
      <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3 mb-4">
        <div className="text-xs uppercase tracking-widest opacity-80 mb-2">Hourly Forecast</div>
        <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar">
          {w.hourly.map((h, i) => {
            const I = codeIcon(h.code);
            return (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[52px]">
                <div className="text-xs opacity-80">{h.time}</div>
                <I className="w-6 h-6" />
                <div className="text-sm font-medium">{h.temp}°</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3 mb-4">
        <div className="text-xs uppercase tracking-widest opacity-80 mb-2">7-Day Forecast</div>
        <div className="space-y-1">
          {w.daily.map((d, i) => {
            const I = codeIcon(d.code);
            const left = ((d.lo - minLo) / range) * 100;
            const width = ((d.hi - d.lo) / range) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-16 text-sm">{d.date}</div>
                <I className="w-5 h-5" />
                <div className="text-sm opacity-70 w-8">{d.lo}°</div>
                <div className="flex-1 h-1 rounded-full bg-white/20 relative">
                  <div
                    className="h-full rounded-full bg-white absolute"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </div>
                <div className="text-sm w-8 text-right">{d.hi}°</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Droplets} label="Humidity" value={`${w.current.humidity}%`} />
        <Stat icon={Wind} label="Wind" value={`${w.current.wind} km/h`} />
        <Stat icon={Sunrise} label="Sunrise" value={w.sunrise || "—"} />
        <Stat icon={Sunset} label="Sunset" value={w.sunset || "—"} />
      </div>
    </div>
  );
}

function Stat({ icon: I, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
        <I className="w-3 h-3" /> {label}
      </div>
      <div className="text-2xl font-light mt-1">{value}</div>
    </div>
  );
}
