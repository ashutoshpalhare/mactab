import { useRef } from "react";
import { motion } from "motion/react";
import { X, Plus } from "lucide-react";
import { useStore } from "../store";

export function Stickies() {
  const stickies = useStore((s) => s.stickies);
  const update = useStore((s) => s.updateSticky);
  const del = useStore((s) => s.deleteSticky);
  const add = useStore((s) => s.addSticky);

  return (
    <>
      {stickies.map((n) => (
        <Sticky key={n.id} n={n} update={update} del={del} />
      ))}
      <button
        onClick={add}
        className="fixed bottom-24 right-4 w-11 h-11 rounded-full glass-strong flex items-center justify-center z-30 hover:scale-105 transition"
        title="Add sticky note"
      >
        <Plus className="w-5 h-5" />
      </button>
    </>
  );
}

function Sticky({
  n,
  update,
  del,
}: {
  n: ReturnType<typeof useStore.getState>["stickies"][number];
  update: (id: string, p: Partial<typeof n>) => void;
  del: (id: string) => void;
}) {
  const dragRef = useRef<{ mx: number; my: number; x: number; y: number } | null>(null);
  const start = (e: React.MouseEvent) => {
    dragRef.current = { mx: e.clientX, my: e.clientY, x: n.x, y: n.y };
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      update(n.id, {
        x: Math.max(0, dragRef.current.x + ev.clientX - dragRef.current.mx),
        y: Math.max(28, dragRef.current.y + ev.clientY - dragRef.current.my),
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
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="absolute rounded-xl shadow-xl overflow-hidden"
      style={{
        left: n.x,
        top: n.y,
        width: n.w,
        height: n.h,
        background: n.color,
        color: "#333",
      }}
    >
      <div
        onMouseDown={start}
        className="h-6 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing bg-black/5"
      >
        <div className="w-4" />
        <button onClick={() => del(n.id)} className="opacity-60 hover:opacity-100">
          <X className="w-3 h-3" />
        </button>
      </div>
      <textarea
        value={n.text}
        onChange={(e) => update(n.id, { text: e.target.value })}
        placeholder="Type here…"
        className="w-full h-[calc(100%-1.5rem)] bg-transparent p-3 outline-none resize-none text-sm"
      />
    </motion.div>
  );
}
