import { useEffect, useRef, useState } from "react";
import { Plus, Search, Trash2, Pin } from "lucide-react";
import { useStore } from "../store";

export default function NotesApp() {
  const notes = useStore((s) => s.notes);
  const add = useStore((s) => s.addNote);
  const update = useStore((s) => s.updateNote);
  const del = useStore((s) => s.deleteNote);
  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null);
  const [q, setQ] = useState("");
  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q.toLowerCase()) ||
      n.content.toLowerCase().includes(q.toLowerCase()),
  );
  const current = notes.find((n) => n.id === selectedId) ?? filtered[0];
  const tid = useRef<number | null>(null);

  useEffect(() => {
    if (!current && filtered[0]) setSelectedId(filtered[0].id);
  }, [current, filtered]);

  const onChange = (patch: Partial<typeof current>) => {
    if (!current) return;
    update(current.id, patch);
    if (tid.current) window.clearTimeout(tid.current);
    tid.current = window.setTimeout(() => {}, 500);
  };

  return (
    <div className="flex h-full text-sm">
      <div className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-3 flex gap-2">
          <button
            onClick={() => setSelectedId(add())}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>
        <div className="px-3 pb-2 relative">
          <Search className="w-3.5 h-3.5 absolute left-5 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-white/10 outline-none text-xs"
          />
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-2 space-y-1">
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedId(n.id)}
              className={`w-full text-left p-2 rounded-lg ${
                current?.id === n.id ? "bg-primary/20" : "hover:bg-white/5"
              }`}
            >
              <div className="font-medium truncate">{n.title || "Untitled"}</div>
              <div className="text-xs opacity-60 truncate">
                {n.content.split("\n")[0] || "No content"}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {current ? (
          <>
            <div className="flex items-center gap-2 p-3 border-b border-white/10">
              <input
                value={current.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="flex-1 bg-transparent outline-none text-lg font-semibold"
                placeholder="Title"
              />
              <Pin className="w-4 h-4 opacity-50" />
              <button
                onClick={() => del(current.id)}
                className="opacity-60 hover:opacity-100 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={current.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Start writing…"
              className="flex-1 bg-transparent outline-none p-4 resize-none leading-relaxed"
            />
            <div className="px-3 py-2 text-xs opacity-50 border-t border-white/10">
              Saved · Autosaves as you type
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-60">
            Create a note to get started
          </div>
        )}
      </div>
    </div>
  );
}
