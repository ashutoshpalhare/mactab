import { Suspense, useRef, useState } from "react";
import { motion } from "motion/react";
import { X, Minus, Square } from "lucide-react";
import { useWindows, type WindowState } from "../windows";
import { APPS } from "../apps";

type SnapZone = "left" | "right" | "top" | "tl" | "tr" | "bl" | "br" | null;

function zoneRect(zone: SnapZone) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const TOP = 28;
  switch (zone) {
    case "left": return { x: 0, y: TOP, w: W / 2, h: H - TOP };
    case "right": return { x: W / 2, y: TOP, w: W / 2, h: H - TOP };
    case "top": return { x: 0, y: TOP, w: W, h: H - TOP };
    case "tl": return { x: 0, y: TOP, w: W / 2, h: (H - TOP) / 2 };
    case "tr": return { x: W / 2, y: TOP, w: W / 2, h: (H - TOP) / 2 };
    case "bl": return { x: 0, y: TOP + (H - TOP) / 2, w: W / 2, h: (H - TOP) / 2 };
    case "br": return { x: W / 2, y: TOP + (H - TOP) / 2, w: W / 2, h: (H - TOP) / 2 };
    default: return null;
  }
}

function detectZone(x: number, y: number): SnapZone {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const E = 12; // edge threshold
  const C = 60; // corner threshold
  const topCorner = y < 28 + C;
  const botCorner = y > H - C;
  if (x < E && topCorner) return "tl";
  if (x > W - E && topCorner) return "tr";
  if (x < E && botCorner) return "bl";
  if (x > W - E && botCorner) return "br";
  if (y < 32) return "top";
  if (x < E) return "left";
  if (x > W - E) return "right";
  return null;
}

export function AppWindow({ w }: { w: WindowState }) {
  const { close, focus, update, toggleMax, minimize } = useWindows();
  const dragRef = useRef<{ x: number; y: number; wx: number; wy: number } | null>(null);
  const [snapZone, setSnapZone] = useState<SnapZone>(null);
  const app = APPS.find((a) => a.id === w.appId);
  if (!app || !app.component) return null;
  const Comp = app.component;

  const startDrag = (e: React.MouseEvent) => {
    if (w.maximized) return;
    focus(w.id);
    dragRef.current = { x: e.clientX, y: e.clientY, wx: w.x, wy: w.y };
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      update(w.id, {
        x: Math.max(0, dragRef.current.wx + ev.clientX - dragRef.current.x),
        y: Math.max(28, dragRef.current.wy + ev.clientY - dragRef.current.y),
      });
      setSnapZone(detectZone(ev.clientX, ev.clientY));
    };
    const up = (ev: MouseEvent) => {
      const zone = detectZone(ev.clientX, ev.clientY);
      dragRef.current = null;
      setSnapZone(null);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      if (zone === "top") {
        toggleMax(w.id);
        return;
      }
      const rect = zoneRect(zone);
      if (rect) update(w.id, { x: rect.x, y: rect.y, w: rect.w, h: rect.h, maximized: false });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const style = w.maximized
    ? { left: 0, top: 28, width: "100vw", height: "calc(100vh - 28px)" }
    : { left: w.x, top: w.y, width: w.w, height: w.h };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: w.minimized ? 0 : 1,
        scale: w.minimized ? 0.3 : 1,
        y: w.minimized ? window.innerHeight : 0,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      style={{ ...style, zIndex: w.z, position: "fixed", pointerEvents: w.minimized ? "none" : "auto" }}
      onMouseDown={() => focus(w.id)}
      className="glass-strong rounded-2xl overflow-hidden flex flex-col"
    >
      <div
        onMouseDown={startDrag}
        onDoubleClick={() => toggleMax(w.id)}
        className="h-10 px-3 flex items-center gap-2 border-b border-white/10 cursor-grab active:cursor-grabbing select-none"
      >
        <button
          onClick={() => close(w.id)}
          className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 flex items-center justify-center group"
        >
          <X className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100" />
        </button>
        <button
          onClick={() => minimize(w.id)}
          className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 flex items-center justify-center group"
        >
          <Minus className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100" />
        </button>
        <button
          onClick={() => toggleMax(w.id)}
          className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 flex items-center justify-center group"
        >
          <Square className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100" />
        </button>
        <div className="flex-1 text-center text-xs font-semibold opacity-80">{w.title}</div>
        <div className="w-14" />
      </div>
      <div className="flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center opacity-60 text-sm">Loading…</div>
          }
        >
          <Comp />
        </Suspense>
      </div>
      {snapZone && (() => {
        const r = zoneRect(snapZone);
        if (!r) return null;
        return (
          <div
            className="snap-preview"
            style={{ left: r.x, top: r.y, width: r.w, height: r.h, position: "fixed" }}
          />
        );
      })()}
    </motion.div>
  );
}
