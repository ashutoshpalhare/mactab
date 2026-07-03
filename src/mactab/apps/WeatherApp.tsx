import { Cloud, Sun, CloudRain, Wind, Droplets, Sunrise, Sunset } from "lucide-react";

const HOURLY = [
  { h: "Now", t: 21, i: Sun },
  { h: "13", t: 22, i: Sun },
  { h: "14", t: 22, i: Cloud },
  { h: "15", t: 21, i: Cloud },
  { h: "16", t: 20, i: CloudRain },
  { h: "17", t: 19, i: CloudRain },
  { h: "18", t: 18, i: Cloud },
  { h: "19", t: 17, i: Cloud },
];
const DAYS = [
  { d: "Today", hi: 24, lo: 16, i: Sun },
  { d: "Tue", hi: 23, lo: 15, i: Cloud },
  { d: "Wed", hi: 21, lo: 14, i: CloudRain },
  { d: "Thu", hi: 22, lo: 15, i: Cloud },
  { d: "Fri", hi: 25, lo: 17, i: Sun },
  { d: "Sat", hi: 26, lo: 18, i: Sun },
  { d: "Sun", hi: 24, lo: 16, i: Cloud },
];

export default function WeatherApp() {
  return (
    <div className="h-full overflow-auto p-6 text-white" style={{ background: "linear-gradient(180deg,#3b82f6 0%,#8b5cf6 100%)" }}>
      <div className="text-center mb-6">
        <div className="text-xl opacity-90">Cupertino</div>
        <div className="text-7xl font-thin mt-2">21°</div>
        <div className="opacity-90">Partly Cloudy</div>
        <div className="text-sm opacity-80">H:24° L:16°</div>
      </div>
      <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3 mb-4">
        <div className="text-xs uppercase tracking-widest opacity-80 mb-2">Hourly Forecast</div>
        <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar">
          {HOURLY.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[52px]">
              <div className="text-xs opacity-80">{h.h}</div>
              <h.i className="w-6 h-6" />
              <div className="text-sm font-medium">{h.t}°</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3 mb-4">
        <div className="text-xs uppercase tracking-widest opacity-80 mb-2">7-Day Forecast</div>
        <div className="space-y-1">
          {DAYS.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 text-sm">{d.d}</div>
              <d.i className="w-5 h-5" />
              <div className="text-sm opacity-70 w-8">{d.lo}°</div>
              <div className="flex-1 h-1 rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{width:"70%"}} /></div>
              <div className="text-sm w-8 text-right">{d.hi}°</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Droplets} label="Humidity" value="62%" />
        <Stat icon={Wind} label="Wind" value="12 km/h" />
        <Stat icon={Sunrise} label="Sunrise" value="06:34" />
        <Stat icon={Sunset} label="Sunset" value="19:52" />
      </div>
    </div>
  );
}

function Stat({ icon: I, label, value }: { icon: typeof Sun; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80"><I className="w-3 h-3" /> {label}</div>
      <div className="text-2xl font-light mt-1">{value}</div>
    </div>
  );
}
