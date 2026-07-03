import { Suspense, useRef } from "react";
import { motion } from "motion/react";
import { X, Minus, Square } from "lucide-react";
import { useWindows, type WindowState } from "../windows";
import { APPS } from "../apps";

export function AppWindow({ w }: { w: WindowState }) {
  const { close, focus, update, toggleMax, minimize } = useWindows();
  const dragRef = useRef<{ x: number; y: number; wx: number; wy: number } | null>(null);
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
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
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
    </motion.div>
  );
}
