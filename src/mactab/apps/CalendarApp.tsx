import { useState } from "react";
import {
  addMonths, subMonths, format, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, getDay, isSameMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarApp() {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const start = startOfMonth(cursor);
  const end = endOfMonth(cursor);
  const days = eachDayOfInterval({ start, end });
  const offset = (getDay(start) + 6) % 7;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">{format(cursor, "MMMM")}</div>
          <div className="text-sm opacity-60">{format(cursor, "yyyy")}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCursor(subMonths(cursor, 1))} className="p-2 rounded-lg hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => { setCursor(new Date()); setSelected(new Date()); }} className="px-3 rounded-lg hover:bg-white/10 text-sm">Today</button>
          <button onClick={() => setCursor(addMonths(cursor, 1))} className="p-2 rounded-lg hover:bg-white/10"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs opacity-60 mb-1">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (<div key={d} className="p-1 text-center font-semibold">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {Array.from({ length: offset }).map((_, i) => <div key={"e"+i} />)}
        {days.map((d) => (
          <button
            key={d.toISOString()}
            onClick={() => setSelected(d)}
            className={`rounded-lg flex flex-col items-center justify-start p-2 transition ${
              isSameDay(d, selected)
                ? "bg-primary text-primary-foreground"
                : isSameDay(d, new Date())
                ? "bg-red-500/80 text-white"
                : isSameMonth(d, cursor)
                ? "hover:bg-white/10"
                : "opacity-40"
            }`}
          >
            <span className="text-lg font-semibold">{format(d, "d")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
