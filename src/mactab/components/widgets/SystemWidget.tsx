import { useEffect, useState } from "react";
import { DraggableWidget } from "../DraggableWidget";
import { Wifi, Cpu } from "lucide-react";

export function SystemWidget() {
  const [online, setOnline] = useState(navigator.onLine);
  const [battery, setBattery] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    // battery
    // @ts-expect-error non standard
    if (navigator.getBattery) {
      // @ts-expect-error non standard
      navigator.getBattery().then((b: BatteryManager) => {
        const update = () => {
          setBattery(Math.round(b.level * 100));
          setCharging(b.charging);
        };
        update();
        b.addEventListener("levelchange", update);
        b.addEventListener("chargingchange", update);
      });
    }
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  const cores = navigator.hardwareConcurrency ?? "—";
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? "—";

  return (
    <DraggableWidget id="system" minWidth={280}>
      <div className="text-xs uppercase tracking-widest opacity-80 mb-2">System</div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4" /> {online ? "Online" : "Offline"}
        </div>
        <div className="flex items-center gap-2">
          🔋 {battery !== null ? `${battery}%${charging ? " ⚡" : ""}` : "—"}
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4" /> {cores} cores
        </div>
        <div className="flex items-center gap-2">
          💾 {mem} GB
        </div>
      </div>
    </DraggableWidget>
  );
}

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}
