import { useEffect, useState } from "react";
import { Apple, Wifi, Battery, Search, Volume2 } from "lucide-react";
import { format } from "date-fns";
import { useWindows } from "../windows";

export function MenuBar({ onSpotlight }: { onSpotlight: () => void }) {
  const [now, setNow] = useState(new Date());
  const windows = useWindows((s) => s.windows);
  const topApp = windows.length
    ? windows.reduce((a, b) => (a.z > b.z ? a : b)).title
    : "Finder";

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-7 z-50 glass px-3 flex items-center justify-between text-[13px] text-foreground/90 select-none">
      <div className="flex items-center gap-4">
        <Apple className="w-4 h-4" fill="currentColor" />
        <span className="font-semibold">{topApp}</span>
        <span className="opacity-70 hidden sm:inline">File</span>
        <span className="opacity-70 hidden sm:inline">Edit</span>
        <span className="opacity-70 hidden sm:inline">View</span>
        <span className="opacity-70 hidden sm:inline">Window</span>
        <span className="opacity-70 hidden sm:inline">Help</span>
      </div>
      <div className="flex items-center gap-3">
        <Battery className="w-4 h-4 opacity-80" />
        <Wifi className="w-4 h-4 opacity-80" />
        <Volume2 className="w-4 h-4 opacity-80" />
        <button
          onClick={onSpotlight}
          className="p-1 rounded hover:bg-white/20"
          aria-label="Spotlight"
        >
          <Search className="w-4 h-4" />
        </button>
        <span className="tabular-nums">{format(now, "EEE d MMM  HH:mm")}</span>
      </div>
    </div>
  );
}
