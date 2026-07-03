import { Cloud, Droplets, Wind } from "lucide-react";
import { DraggableWidget } from "../DraggableWidget";

export function WeatherWidget() {
  // Static demo weather; architecture allows swapping to a live API.
  return (
    <DraggableWidget id="weather" minWidth={260}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest opacity-80">Weather</div>
          <div className="text-4xl font-semibold mt-1">21°</div>
          <div className="text-sm opacity-80">Partly cloudy</div>
        </div>
        <Cloud className="w-14 h-14 opacity-90" />
      </div>
      <div className="mt-3 flex justify-between text-xs opacity-80">
        <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> 62%</span>
        <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> 12km/h</span>
        <span>H:24° L:16°</span>
      </div>
    </DraggableWidget>
  );
}
