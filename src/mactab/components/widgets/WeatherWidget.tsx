import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Snowflake,
  Sun,
  Wind,
} from "lucide-react";
import { DraggableWidget } from "../DraggableWidget";
import { useWeather, weatherIcon, weatherLabel } from "../../hooks/useWeather";

const ICONS = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-rain": CloudRain,
  snowflake: Snowflake,
  "cloud-lightning": CloudLightning,
} as const;

export function WeatherWidget() {
  const w = useWeather();
  const Icon = ICONS[weatherIcon(w.current.code) as keyof typeof ICONS] ?? Cloud;
  const today = w.daily[0];

  return (
    <DraggableWidget id="weather" minWidth={260}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest opacity-80">{w.location}</div>
          <div className="text-4xl font-semibold mt-1">
            {w.loading ? "—" : `${w.current.temp}°`}
          </div>
          <div className="text-sm opacity-80">{weatherLabel(w.current.code)}</div>
        </div>
        <Icon className="w-14 h-14 opacity-90" />
      </div>
      <div className="mt-3 flex justify-between text-xs opacity-80">
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3" /> {w.current.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3" /> {w.current.wind}km/h
        </span>
        {today && (
          <span>
            H:{today.hi}° L:{today.lo}°
          </span>
        )}
      </div>
    </DraggableWidget>
  );
}
