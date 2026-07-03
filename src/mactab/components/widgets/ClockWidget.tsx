import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DraggableWidget } from "../DraggableWidget";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <DraggableWidget id="clock" minWidth={260}>
      <div className="text-xs uppercase tracking-widest opacity-80">{format(now, "EEEE")}</div>
      <div className="text-5xl font-semibold tabular-nums mt-1">{format(now, "HH:mm")}</div>
      <div className="text-sm opacity-80 mt-1">{format(now, "d MMMM yyyy")}</div>
    </DraggableWidget>
  );
}
