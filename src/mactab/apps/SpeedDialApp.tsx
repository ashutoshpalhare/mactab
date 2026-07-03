import { useState } from "react";
import { Plus, X, ExternalLink } from "lucide-react";
import { useStore } from "../store";

export default function SpeedDialApp() {
  const dials = useStore((s) => s.speedDials);
  const add = useStore((s) => s.addSpeedDial);
  const del = useStore((s) => s.deleteSpeedDial);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [nm, setNm] = useState("");
  const [url, setUrl] = useState("");

  const submit = () => {
    if (!nm || !url) return;
    let u = url;
    if (!/^https?:/.test(u)) u = "https://" + u;
    add(nm, u);
    setNm(""); setUrl(""); setAdding(false);
  };

  const filtered = dials.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center gap-3 mb-6">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search sites"
          className="flex-1 px-3 py-2 rounded-xl bg-white/10 outline-none text-sm" />
        <button onClick={() => setAdding((a) => !a)} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {adding && (
        <div className="mb-4 flex gap-2">
          <input placeholder="Name" value={nm} onChange={(e)=>setNm(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-white/10 outline-none text-sm" />
          <input placeholder="https://example.com" value={url} onChange={(e)=>setUrl(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter"&&submit()}
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 outline-none text-sm" />
          <button onClick={submit} className="px-3 rounded-lg bg-primary text-primary-foreground text-sm">Save</button>
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 overflow-auto pb-4">
        {filtered.map((d) => {
          const domain = new URL(d.url).hostname;
          return (
            <div key={d.id} className="group relative">
              <a href={d.url} target="_blank" rel="noreferrer"
                className="block p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition hover:scale-105 aspect-square flex flex-col items-center justify-center">
                <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" className="w-12 h-12 rounded-lg mb-2"
                  onError={(e)=>((e.currentTarget.style.display="none"))} />
                <div className="text-xs text-center truncate w-full font-medium">{d.name}</div>
              </a>
              <button onClick={() => del(d.id)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 opacity-60 text-sm flex flex-col items-center gap-2">
            <ExternalLink className="w-8 h-8" /> No sites yet
          </div>
        )}
      </div>
    </div>
  );
}
