import { useRef } from "react";
import { motion } from "motion/react";
import { useStore } from "../store";

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
}

export function DraggableWidget({ id, children, className, minWidth = 240 }: Props) {
  const widget = useStore((s) => s.widgets[id]);
  const setWidget = useStore((s) => s.setWidget);
  const dragRef = useRef<{ mx: number; my: number; x: number; y: number } | null>(null);

  if (!widget || !widget.visible) return null;

  const start = (e: React.MouseEvent) => {
    dragRef.current = { mx: e.clientX, my: e.clientY, x: widget.x, y: widget.y };
    const move = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setWidget(id, {
        x: Math.max(0, dragRef.current.x + ev.clientX - dragRef.current.mx),
        y: Math.max(0, dragRef.current.y + ev.clientY - dragRef.current.my),
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      style={{ left: widget.x, top: widget.y, minWidth, position: "absolute" }}
      className={`glass rounded-3xl p-4 text-white shadow-xl select-none ${className ?? ""}`}
      onMouseDown={start}
    >
      {children}
    </motion.div>
  );
}
