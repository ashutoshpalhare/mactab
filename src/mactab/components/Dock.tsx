import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useStore } from "../store";
import { useWindows } from "../windows";
import { APPS, preloadApp } from "../apps";

export function Dock() {
  const dockPosition = useStore((s) => s.dockPosition);
  const autoHide = useStore((s) => s.dockAutoHide);
  const open = useWindows((s) => s.open);
  const windows = useWindows((s) => s.windows);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [hidden, setHidden] = useState(autoHide);

  useEffect(() => {
    if (!autoHide) {
      setHidden(false);
      return;
    }
    const onMove = (e: MouseEvent) => {
      if (dockPosition === "bottom") setHidden(window.innerHeight - e.clientY > 80);
      else if (dockPosition === "left") setHidden(e.clientX > 80);
      else setHidden(window.innerWidth - e.clientX > 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [autoHide, dockPosition]);

  const pinned = APPS.filter((a) => a.pinned);
  const running = new Set(windows.map((w) => w.appId));
  const isVertical = dockPosition !== "bottom";

  const posClass =
    dockPosition === "bottom"
      ? "bottom-3 left-1/2 -translate-x-1/2"
      : dockPosition === "left"
      ? "left-3 top-1/2 -translate-y-1/2"
      : "right-3 top-1/2 -translate-y-1/2";

  const hideTransform =
    dockPosition === "bottom"
      ? "translateY(120%) translateX(-50%)"
      : dockPosition === "left"
      ? "translateX(-120%) translateY(-50%)"
      : "translateX(120%) translateY(-50%)";

  return (
    <motion.div
      className={`fixed z-40 ${posClass}`}
      animate={{
        transform: hidden
          ? hideTransform
          : dockPosition === "bottom"
          ? "translateY(0) translateX(-50%)"
          : `translateY(-50%) translateX(0)`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseLeave={() => {
        setMouseX(null);
        setMouseY(null);
      }}
    >
      <div
        className={`glass-strong flex gap-1 p-2 rounded-3xl ${isVertical ? "flex-col" : "flex-row"}`}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setMouseX(e.clientX - r.left);
          setMouseY(e.clientY - r.top);
        }}
      >
        {pinned.map((app, i) => {
          const Icon = app.icon;
          return (
            <DockIcon
              key={app.id}
              app={app}
              index={i}
              mouse={isVertical ? mouseY : mouseX}
              onClick={() => open(app.id)}
              running={running.has(app.id)}
              vertical={isVertical}
            />
          );
        })}
        <div className={isVertical ? "h-px w-full bg-white/20 my-1" : "w-px h-full bg-white/20 mx-1"} />
        <button
          onClick={() => open("trash")}
          className="w-14 h-14 flex items-center justify-center rounded-2xl hover:bg-white/10"
          title="Trash"
        >
          {(() => {
            const T = APPS.find((a) => a.id === "trash")!.icon;
            return <T className="w-8 h-8 text-white/80" />;
          })()}
        </button>
      </div>
    </motion.div>
  );
}

function DockIcon({
  app,
  mouse,
  onClick,
  running,
  vertical,
}: {
  app: (typeof APPS)[number];
  index: number;
  mouse: number | null;
  onClick: () => void;
  running: boolean;
  vertical: boolean;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const distance =
    mouse === null || !rect
      ? Infinity
      : Math.abs(mouse - (vertical ? rect.top + rect.height / 2 - (rect.top - (rect.y - (rect.top - rect.y))) : rect.left + rect.width / 2));

  // simpler distance calc using ref via ownContainer
  return (
    <motion.button
      ref={(el) => {
        if (el && !rect) setRect(el.getBoundingClientRect());
      }}
      onClick={onClick}
      onMouseEnter={() => preloadApp(app.id)}
      onFocus={() => preloadApp(app.id)}
      className="relative flex items-center justify-center rounded-2xl"
      style={{ width: 56, height: 56 }}
      whileHover={{ scale: 1.35, y: vertical ? 0 : -8, x: vertical ? (mouse === null ? 0 : 0) : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      title={app.name}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${app.color}, ${app.color}dd)`,
          boxShadow: `0 8px 20px ${app.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
        }}
      >
        <app.icon className="w-6 h-6 text-white drop-shadow" />
      </div>
      {running && (
        <span
          className={`absolute rounded-full bg-white/90 ${
            vertical ? "left-0 top-1/2 -translate-y-1/2 w-1 h-1" : "bottom-0 left-1/2 -translate-x-1/2 w-1 h-1"
          }`}
        />
      )}
      {/* silence distance unused */}
      <span className="hidden">{distance}</span>
    </motion.button>
  );
}
