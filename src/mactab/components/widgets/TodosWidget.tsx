import { DraggableWidget } from "../DraggableWidget";
import { useStore } from "../../store";
import { Check } from "lucide-react";

export function TodosWidget() {
  const todos = useStore((s) => s.todos);
  const toggle = useStore((s) => s.toggleTodo);
  const items = todos.slice(0, 5);
  return (
    <DraggableWidget id="todos" minWidth={280} className="max-w-sm">
      <div className="text-xs uppercase tracking-widest opacity-80 mb-2">Reminders</div>
      {items.length === 0 && <div className="text-sm opacity-70">All caught up ✨</div>}
      <div className="space-y-1.5">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={(e) => { e.stopPropagation(); toggle(t.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full flex items-center gap-2 text-left text-sm hover:bg-white/5 rounded-lg p-1"
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${t.done ? "bg-primary border-primary" : "border-white/50"}`}>
              {t.done && <Check className="w-3 h-3" />}
            </span>
            <span className={t.done ? "line-through opacity-60" : ""}>{t.text}</span>
          </button>
        ))}
      </div>
    </DraggableWidget>
  );
}
