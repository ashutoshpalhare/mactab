import { useMemo } from "react";
import { DraggableWidget } from "../DraggableWidget";
import { Quote } from "lucide-react";

const QUOTES = [
  { q: "Simplicity is the ultimate sophistication.", a: "Leonardo da Vinci" },
  { q: "Design is not just what it looks like. Design is how it works.", a: "Steve Jobs" },
  { q: "Stay hungry. Stay foolish.", a: "Steve Jobs" },
  { q: "Details matter. It's worth waiting to get it right.", a: "Steve Jobs" },
  { q: "Focus is about saying no.", a: "Steve Jobs" },
  { q: "Well done is better than well said.", a: "Benjamin Franklin" },
  { q: "The best way to predict the future is to invent it.", a: "Alan Kay" },
];

export function QuoteWidget() {
  const pick = useMemo(() => {
    const day = Math.floor(Date.now() / 86400000);
    return QUOTES[day % QUOTES.length];
  }, []);
  return (
    <DraggableWidget id="quote" minWidth={280} className="max-w-sm">
      <div className="flex items-start gap-3">
        <Quote className="w-6 h-6 opacity-70 shrink-0" />
        <div>
          <div className="text-sm leading-snug">"{pick.q}"</div>
          <div className="text-xs opacity-70 mt-2">— {pick.a}</div>
        </div>
      </div>
    </DraggableWidget>
  );
}
