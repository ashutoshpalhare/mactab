import { useEffect, useState } from "react";
import { Copy, Pin, Trash2, Plus } from "lucide-react";
import { useStore } from "../store";

export default function ClipboardApp() {
  const clipboard = useStore((s) => s.clipboard);
  const push = useStore((s) => s.pushClipboard);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!navigator.clipboard?.readText) return;
    const t = setInterval(async () => {
      try {
        const val = await navigator.clipboard.readText();
        if (val && val.length < 5000 && !clipboard.some((c) => c.text === val)) {
          push(val);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(t);
  }, [clipboard, push]);

  const filtered = clipboard.filter((c) => c.text.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex gap-2 mb-3">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search clips"
          className="flex-1 px-3 py-2 rounded-xl bg-white/10 outline-none text-sm" />
      </div>
      <div className="flex gap-2 mb-3">
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Add manually…"
          className="flex-1 px-3 py-2 rounded-xl bg-white/10 outline-none text-sm" />
        <button onClick={() => { if (text) { push(text); setText(""); } }}
          className="px-3 rounded-xl bg-primary text-primary-foreground"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-auto no-scrollbar space-y-1">
        {filtered.map((c) => (
          <div key={c.id} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white/5">
            <Pin className="w-3 h-3 mt-1 opacity-40" />
            <div className="flex-1 text-sm break-all">{c.text}</div>
            <button onClick={() => navigator.clipboard?.writeText(c.text)} className="opacity-60 hover:opacity-100"><Copy className="w-4 h-4" /></button>
          </div>
        ))}
        {!filtered.length && <div className="text-center opacity-60 py-8 text-sm">No clipboard history</div>}
      </div>
    </div>
  );
}
