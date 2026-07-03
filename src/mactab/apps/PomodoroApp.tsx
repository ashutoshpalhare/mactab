import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const MODES = [
  { id: "focus", label: "Focus", mins: 25, color: "#f97316" },
  { id: "short", label: "Short Break", mins: 5, color: "#10b981" },
  { id: "long", label: "Long Break", mins: 15, color: "#3b82f6" },
];

export default function PomodoroApp() {
  const [modeIdx, setModeIdx] = useState(0);
  const mode = MODES[modeIdx];
  const [left, setLeft] = useState(mode.mins * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => { setLeft(mode.mins * 60); setRunning(false); }, [mode.mins]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => {
    if (left === 0 && running) { setRunning(false); setSessions((s) => s + 1); }
  }, [left, running]);

  const pct = 1 - left / (mode.mins * 60);
  const c = 2 * Math.PI * 90;

  return (
    <div className="h-full flex flex-col items-center p-6">
      <div className="flex gap-1 p-1 rounded-full bg-white/10 mb-6">
        {MODES.map((m, i) => (
          <button key={m.id} onClick={() => setModeIdx(i)}
            className={`px-4 py-1.5 rounded-full text-sm ${i===modeIdx?"bg-white/90 text-black":"opacity-70"}`}>{m.label}</button>
        ))}
      </div>
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
          <circle cx="100" cy="100" r="90" fill="none" stroke={mode.color} strokeWidth="10"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl tabular-nums font-light">
            {String(Math.floor(left/60)).padStart(2,"0")}:{String(left%60).padStart(2,"0")}
          </div>
          <div className="text-xs opacity-60 mt-1">{mode.label}</div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={()=>setRunning(r=>!r)} className="w-14 h-14 rounded-full flex items-center justify-center text-white" style={{background:mode.color}}>
          {running?<Pause className="w-6 h-6" />:<Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button onClick={()=>{setLeft(mode.mins*60);setRunning(false);}} className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-6 text-sm opacity-70">Completed today: <span className="font-semibold">{sessions}</span></div>
    </div>
  );
}
