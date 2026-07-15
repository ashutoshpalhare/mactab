import { useEffect, useState } from "react";

export interface WeatherData {
  loading: boolean;
  error?: string;
  location: string;
  current: {
    temp: number;
    code: number;
    wind: number;
    humidity: number;
    apparent: number;
  };
  hourly: { time: string; temp: number; code: number }[];
  daily: { date: string; hi: number; lo: number; code: number }[];
  sunrise: string;
  sunset: string;
}

const CACHE_KEY = "mactab-weather";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

export function weatherLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

async function fetchCoords(): Promise<{ lat: number; lon: number; name: string }> {
  const geo = await new Promise<GeolocationPosition | null>((res) => {
    if (!navigator.geolocation) return res(null);
    navigator.geolocation.getCurrentPosition(
      (p) => res(p),
      () => res(null),
      { timeout: 4000, maximumAge: 3600_000 },
    );
  });
  if (geo) {
    const { latitude, longitude } = geo.coords;
    try {
      const r = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en`,
      );
      const j = await r.json();
      const name = j?.results?.[0]?.name ?? "Your location";
      return { lat: latitude, lon: longitude, name };
    } catch {
      return { lat: latitude, lon: longitude, name: "Your location" };
    }
  }
  // fallback: IP-based
  try {
    const r = await fetch("https://ipapi.co/json/");
    const j = await r.json();
    return { lat: j.latitude, lon: j.longitude, name: j.city ?? "Your location" };
  } catch {
    return { lat: 37.3230, lon: -122.0322, name: "Cupertino" };
  }
}

export function useWeather(): WeatherData {
  const [data, setData] = useState<WeatherData>(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Date.now() - p.at < CACHE_TTL) return { ...p.data, loading: false };
      }
    } catch {}
    return {
      loading: true,
      location: "…",
      current: { temp: 0, code: 0, wind: 0, humidity: 0, apparent: 0 },
      hourly: [],
      daily: [],
      sunrise: "",
      sunset: "",
    };
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { lat, lon, name } = await fetchCoords();
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=7`;
        const r = await fetch(url);
        const j = await r.json();
        if (cancelled) return;
        const now = new Date();
        const hourIdx = j.hourly.time.findIndex((t: string) => new Date(t) >= now);
        const start = hourIdx === -1 ? 0 : hourIdx;
        const hourly = Array.from({ length: 8 }, (_, i) => {
          const idx = start + i;
          return {
            time: i === 0 ? "Now" : new Date(j.hourly.time[idx]).getHours() + "",
            temp: Math.round(j.hourly.temperature_2m[idx]),
            code: j.hourly.weather_code[idx],
          };
        });
        const daily = j.daily.time.map((t: string, i: number) => ({
          date: i === 0 ? "Today" : new Date(t).toLocaleDateString(undefined, { weekday: "short" }),
          hi: Math.round(j.daily.temperature_2m_max[i]),
          lo: Math.round(j.daily.temperature_2m_min[i]),
          code: j.daily.weather_code[i],
        }));
        const fmt = (s: string) =>
          new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const next: WeatherData = {
          loading: false,
          location: name,
          current: {
            temp: Math.round(j.current.temperature_2m),
            code: j.current.weather_code,
            wind: Math.round(j.current.wind_speed_10m),
            humidity: Math.round(j.current.relative_humidity_2m),
            apparent: Math.round(j.current.apparent_temperature),
          },
          hourly,
          daily,
          sunrise: fmt(j.daily.sunrise[0]),
          sunset: fmt(j.daily.sunset[0]),
        };
        setData(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: next }));
        } catch {}
      } catch (e) {
        if (!cancelled) setData((d) => ({ ...d, loading: false, error: String(e) }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

export function weatherIcon(code: number) {
  // Return a lucide icon name key handled by caller
  if (code === 0) return "sun";
  if (code <= 2) return "cloud-sun";
  if (code === 3) return "cloud";
  if (code <= 48) return "cloud-fog";
  if (code <= 67) return "cloud-rain";
  if (code <= 77) return "snowflake";
  if (code <= 82) return "cloud-rain";
  if (code <= 86) return "snowflake";
  return "cloud-lightning";
}
