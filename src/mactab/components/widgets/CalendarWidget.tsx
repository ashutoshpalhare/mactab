import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";
import { DraggableWidget } from "../DraggableWidget";

export function CalendarWidget() {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const days = eachDayOfInterval({ start, end });
  const offset = (getDay(start) + 6) % 7;
  return (
    <DraggableWidget id="calendar" minWidth={260}>
      <div className="text-xs uppercase tracking-widest opacity-80">{format(now, "MMMM yyyy")}</div>
      <div className="grid grid-cols-7 gap-1 text-[10px] mt-2 opacity-70">
        {["M","T","W","T","F","S","S"].map((d,i)=>(<div key={i} className="text-center">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs mt-1">
        {Array.from({ length: offset }).map((_, i) => <div key={"e"+i} />)}
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className={`text-center py-1 rounded-md ${
              isSameDay(d, now) ? "bg-red-500 text-white font-semibold" : "hover:bg-white/10"
            }`}
          >
            {format(d, "d")}
          </div>
        ))}
      </div>
    </DraggableWidget>
  );
}
