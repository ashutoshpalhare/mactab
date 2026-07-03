import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useStore, type Todo } from "../store";

export default function TodosApp() {
  const todos = useStore((s) => s.todos);
  const add = useStore((s) => s.addTodo);
  const toggle = useStore((s) => s.toggleTodo);
  const del = useStore((s) => s.deleteTodo);
  const [text, setText] = useState("");
  const [prio, setPrio] = useState<Todo["priority"]>("med");

  const submit = () => {
    if (!text.trim()) return;
    add(text.trim(), prio);
    setText("");
  };

  const colors: Record<Todo["priority"], string> = {
    low: "bg-emerald-500", med: "bg-amber-500", high: "bg-red-500",
  };

  return (
    <div className="h-full flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <div className="flex gap-2 mb-4">
        <input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&submit()}
          placeholder="New reminder" className="flex-1 px-3 py-2 rounded-xl bg-white/10 outline-none text-sm" />
        <select value={prio} onChange={(e)=>setPrio(e.target.value as Todo["priority"])}
          className="px-2 py-2 rounded-xl bg-white/10 outline-none text-sm">
          <option value="low">Low</option><option value="med">Medium</option><option value="high">High</option>
        </select>
        <button onClick={submit} className="px-3 rounded-xl bg-primary text-primary-foreground"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-auto no-scrollbar space-y-1">
        {todos.map((t) => (
          <div key={t.id} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
            <span className={`w-2.5 h-2.5 rounded-full ${colors[t.priority]}`} />
            <button onClick={() => toggle(t.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${t.done?"bg-primary border-primary":"border-white/40"}`}>
              {t.done && <span className="w-2 h-2 rounded-full bg-white" />}
            </button>
            <span className={`flex-1 text-sm ${t.done?"line-through opacity-50":""}`}>{t.text}</span>
            <button onClick={() => del(t.id)} className="opacity-0 group-hover:opacity-100 text-destructive"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {!todos.length && <div className="text-center opacity-60 py-8 text-sm">No reminders yet</div>}
      </div>
    </div>
  );
}
