import { useMemo, useState } from "react";
import { Palette, QrCode, Key, Hash, Type, FileJson } from "lucide-react";

type Tool = "color" | "qr" | "password" | "counter" | "base64" | "json";

const TOOLS: { id: Tool; name: string; icon: typeof Palette }[] = [
  { id: "color", name: "Color Picker", icon: Palette },
  { id: "qr", name: "QR Generator", icon: QrCode },
  { id: "password", name: "Password Gen", icon: Key },
  { id: "counter", name: "Char Counter", icon: Type },
  { id: "base64", name: "Base64", icon: Hash },
  { id: "json", name: "JSON Format", icon: FileJson },
];

export default function UtilitiesApp() {
  const [tool, setTool] = useState<Tool>("color");
  return (
    <div className="h-full flex">
      <div className="w-48 border-r border-white/10 p-2 space-y-1">
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setTool(t.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${tool===t.id?"bg-primary text-primary-foreground":"hover:bg-white/10"}`}>
            <t.icon className="w-4 h-4" /> {t.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-6">
        {tool === "color" && <ColorPicker />}
        {tool === "qr" && <QRGen />}
        {tool === "password" && <PasswordGen />}
        {tool === "counter" && <CharCounter />}
        {tool === "base64" && <Base64 />}
        {tool === "json" && <JsonFormat />}
      </div>
    </div>
  );
}

function ColorPicker() {
  const [c, setC] = useState("#5b6cff");
  return (
    <div className="space-y-4">
      <input type="color" value={c} onChange={(e)=>setC(e.target.value)} className="w-40 h-40 rounded-2xl cursor-pointer" />
      <div className="space-y-1 text-sm font-mono">
        <div>HEX: {c}</div>
        <div>RGB: {parseInt(c.slice(1,3),16)}, {parseInt(c.slice(3,5),16)}, {parseInt(c.slice(5,7),16)}</div>
      </div>
    </div>
  );
}
function QRGen() {
  const [t, setT] = useState("https://lovable.dev");
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(t)}`;
  return (
    <div className="space-y-3">
      <input value={t} onChange={(e)=>setT(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 outline-none text-sm" />
      <img src={url} alt="QR" className="rounded-xl bg-white p-2" width={240} height={240} />
    </div>
  );
}
function PasswordGen() {
  const [len, setLen] = useState(16);
  const pwd = useMemo(() => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, Math.random()]);
  const [p, setP] = useState(pwd);
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-white/10 font-mono text-sm break-all">{p}</div>
      <label className="text-sm">Length: {len}
        <input type="range" min={8} max={64} value={len} onChange={(e)=>setLen(+e.target.value)} className="w-full" /></label>
      <button onClick={()=>setP(pwd)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Regenerate</button>
    </div>
  );
}
function CharCounter() {
  const [t, setT] = useState("");
  return (
    <div className="space-y-3">
      <textarea value={t} onChange={(e)=>setT(e.target.value)} className="w-full h-40 p-3 rounded-lg bg-white/10 outline-none text-sm" placeholder="Type here…" />
      <div className="text-sm opacity-80">
        Characters: {t.length} · Words: {t.trim().split(/\s+/).filter(Boolean).length} · Lines: {t.split("\n").length}
      </div>
    </div>
  );
}
function Base64() {
  const [t, setT] = useState("");
  return (
    <div className="space-y-3">
      <textarea value={t} onChange={(e)=>setT(e.target.value)} placeholder="Text or base64" className="w-full h-32 p-3 rounded-lg bg-white/10 outline-none text-sm" />
      <div className="flex gap-2">
        <button onClick={()=>{ try { setT(btoa(t)); } catch { setT("Invalid input"); } }} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Encode</button>
        <button onClick={()=>{ try { setT(atob(t)); } catch { setT("Invalid base64"); } }} className="px-3 py-2 rounded-lg bg-white/20 text-sm">Decode</button>
      </div>
    </div>
  );
}
function JsonFormat() {
  const [t, setT] = useState("{\"hello\":\"world\"}");
  const [out, setOut] = useState("");
  return (
    <div className="space-y-3">
      <textarea value={t} onChange={(e)=>setT(e.target.value)} className="w-full h-32 p-3 rounded-lg bg-white/10 outline-none font-mono text-xs" />
      <div className="flex gap-2">
        <button onClick={()=>{ try { setOut(JSON.stringify(JSON.parse(t), null, 2)); } catch (e) { setOut(String(e)); } }} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Format</button>
        <button onClick={()=>{ try { setOut(JSON.stringify(JSON.parse(t))); } catch (e) { setOut(String(e)); } }} className="px-3 py-2 rounded-lg bg-white/20 text-sm">Minify</button>
      </div>
      <pre className="p-3 rounded-lg bg-white/10 text-xs overflow-auto max-h-48 whitespace-pre-wrap">{out}</pre>
    </div>
  );
}
