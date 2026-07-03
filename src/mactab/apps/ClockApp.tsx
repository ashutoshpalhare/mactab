import { useEffect, useState } from "react";
import { format } from "date-fns";

const ZONES = [
  { name: "Cupertino", tz: "America/Los_Angeles" },
  { name: "New York", tz: "America/New_York" },
  { name: "London", tz: "Europe/London" },
  { name: "Tokyo", tz: "Asia/Tokyo" },
];

export default function ClockApp() {
  const [tab, setTab] = useState<"world" | "stopwatch" | "timer">("world");
  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["world","stopwatch","timer"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm capitalize ${tab===t?"bg-primary text-primary-foreground":"hover:bg-white/10"}`}
          >{t}</button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-6">
        {tab === "world" && <WorldClock />}
        {tab === "stopwatch" && <Stopwatch />}
        {tab === "timer" && <Timer />}
      </div>
    </div>
  );
}

function WorldClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); }, []);
  return (
    <div className="grid grid-cols-2 gap-4">
      {ZONES.map((z) => (
        <div key={z.tz} className="p-5 rounded-2xl bg-white/10">
          <div className="text-sm opacity-70">{z.name}</div>
          <div className="text-4xl tabular-nums font-light mt-1">
            {new Intl.DateTimeFormat("en-GB", { timeZone: z.tz, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now)}
          </div>
          <div className="text-xs opacity-60 mt-1">{format(now, "EEE d MMM")}</div>
        </div>
      ))}
    </div>
  );
}

function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const start = Date.now() - ms;
    const t = setInterval(() => setMs(Date.now() - start), 33);
    return () => clearInterval(t);
  }, [running, ms]);
  const s = Math.floor(ms / 1000);
  const f = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      <div className="text-6xl tabular-nums font-light">
        {String(Math.floor(s / 60)).padStart(2,"0")}:{String(s%60).padStart(2,"0")}.{f}
      </div>
      <div className="flex gap-3">
        <button onClick={()=>setRunning(r=>!r)} className="px-6 py-2 rounded-full bg-primary text-primary-foreground">{running?"Stop":"Start"}</button>
        <button onClick={()=>{setRunning(false);setMs(0);}} className="px-6 py-2 rounded-full bg-white/20">Reset</button>
      </div>
    </div>
  );
}

function Timer() {
  const [dur, setDur] = useState(60);
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { if (left === 0) setRunning(false); }, [left]);
  return (
    <div className="flex flex-col items-center gap-6 pt-6">
      <div className="text-6xl tabular-nums font-light">
        {String(Math.floor(left/60)).padStart(2,"0")}:{String(left%60).padStart(2,"0")}
      </div>
      <input type="range" min={5} max={3600} step={5} value={dur} onChange={(e)=>{ setDur(+e.target.value); setLeft(+e.target.value); }} className="w-64" />
      <div className="flex gap-3">
        <button onClick={()=>setRunning(r=>!r)} className="px-6 py-2 rounded-full bg-primary text-primary-foreground">{running?"Pause":"Start"}</button>
        <button onClick={()=>{setRunning(false);setLeft(dur);}} className="px-6 py-2 rounded-full bg-white/20">Reset</button>
      </div>
    </div>
  );
}
