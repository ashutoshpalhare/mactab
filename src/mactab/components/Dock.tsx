import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useStore } from "../store";
import { useWindows } from "../windows";
import { APPS, type AppDef, preloadApp } from "../apps";
import { DynamicClockIcon, DynamicWeatherIcon } from "./DynamicIcons";

const BASE = 52;
const MAX = 84;
const RANGE = 140;

export function Dock() {
  const dockPosition = useStore((s) => s.dockPosition);
  const autoHide = useStore((s) => s.dockAutoHide);
  const magnify = useStore((s) => s.dockMagnification);
  const dockHidden = useStore((s) => s.dockHidden);
  const badges = useStore((s) => s.badges);
  const open = useWindows((s) => s.open);
  const windows = useWindows((s) => s.windows);
  const [hidden, setHidden] = useState(autoHide);
  const [menu, setMenu] = useState<{ app: AppDef; x: number; y: number } | null>(null);

  const mouseX = useMotionValue<number>(Infinity);
  const mouseY = useMotionValue<number>(Infinity);

  useEffect(() => {
    if (!autoHide) return setHidden(false);
    const onMove = (e: MouseEvent) => {
      if (dockPosition === "bottom") setHidden(window.innerHeight - e.clientY > 80);
      else if (dockPosition === "left") setHidden(e.clientX > 80);
      else setHidden(window.innerWidth - e.clientX > 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [autoHide, dockPosition]);

  useEffect(() => {
    const close = () => setMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, []);

  const pinned = APPS.filter((a) => a.pinned && !dockHidden.includes(a.id));
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
    <>
      <motion.div
        className={`fixed z-40 ${posClass}`}
        animate={{
          transform: hidden
            ? hideTransform
            : dockPosition === "bottom"
            ? "translateY(0) translateX(-50%)"
            : "translateY(-50%) translateX(0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
          mouseY.set(Infinity);
        }}
      >
        <div
          className={`glass-strong flex gap-1.5 px-3 py-2 rounded-3xl items-end ${isVertical ? "flex-col items-center py-3 px-2" : ""}`}
          style={{
            boxShadow:
              "0 24px 60px -12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
          onMouseMove={(e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
          }}
        >
          {pinned.map((app) => (
            <DockIcon
              key={app.id}
              app={app}
              mouseX={mouseX}
              mouseY={mouseY}
              magnify={magnify}
              vertical={isVertical}
              running={running.has(app.id)}
              badge={badges[app.id] ?? 0}
              onClick={() => open(app.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu({ app, x: e.clientX, y: e.clientY });
              }}
            />
          ))}
        </div>
      </motion.div>
      {menu && <DockContextMenu {...menu} onClose={() => setMenu(null)} />}
    </>
  );
}

function DockIcon({
  app,
  mouseX,
  mouseY,
  magnify,
  vertical,
  running,
  badge,
  onClick,
  onContextMenu,
}: {
  app: AppDef;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  magnify: boolean;
  vertical: boolean;
  running: boolean;
  badge: number;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform<number, number>(vertical ? mouseY : mouseX, (v) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return RANGE * 2;
    const center = vertical ? r.top + r.height / 2 : r.left + r.width / 2;
    return v - center;
  });

  const sizeRaw = useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 220, damping: 16 });
  const disabled = !magnify;

  return (
    <div className={`relative flex ${vertical ? "flex-row items-center" : "flex-col items-center"}`}>
      <motion.button
        ref={ref}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseEnter={() => preloadApp(app.id)}
        onFocus={() => preloadApp(app.id)}
        className="relative flex items-end justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-2xl"
        style={{
          width: disabled ? BASE : size,
          height: disabled ? BASE : size,
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        title={app.name}
      >
        <div
          className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              app.id === "clock"
                ? "linear-gradient(135deg,#f3f4f6,#d1d5db)"
                : `linear-gradient(135deg, ${app.color}, ${app.color}cc)`,
            boxShadow: `0 10px 24px ${app.color}66, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2)`,
          }}
        >
          <IconContent app={app} />
        </div>
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white/40 shadow-md">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </motion.button>
      <span
        className={`${vertical ? "ml-1" : "mt-1"} rounded-full transition-all duration-200 ${
          running ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "bg-transparent"
        }`}
        style={
          vertical
            ? { width: 4, height: running ? 4 : 0 }
            : { height: 4, width: running ? 4 : 0 }
        }
      />
    </div>
  );
}

function IconContent({ app }: { app: AppDef }) {
  if (app.id === "clock") return <DynamicClockIcon size={44} />;
  if (app.id === "weather") return <DynamicWeatherIcon size={44} />;
  const Icon = app.icon;
  return <Icon className="w-1/2 h-1/2 text-white drop-shadow-md" />;
}

function DockContextMenu({
  app,
  x,
  y,
  onClose,
}: {
  app: AppDef;
  x: number;
  y: number;
  onClose: () => void;
}) {
  const open = useWindows((s) => s.open);
  const close = useWindows((s) => s.close);
  const windows = useWindows((s) => s.windows);
  const toggleDockPin = useStore((s) => s.toggleDockPin);
  const setBadge = useStore((s) => s.setBadge);
  const appWindows = windows.filter((w) => w.appId === app.id);

  const act = (fn: () => void) => () => {
    fn();
    onClose();
  };

  return (
    <div
      className="fixed z-50 glass-strong rounded-xl py-1.5 min-w-[200px] text-sm shadow-2xl"
      style={{ left: Math.min(x, window.innerWidth - 220), top: Math.max(8, y - 220) }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="px-3 py-1.5 text-xs opacity-60 uppercase tracking-wider">{app.name}</div>
      <MenuItem label="Open" onClick={act(() => open(app.id))} />
      {appWindows.length > 0 && (
        <MenuItem
          label={`Quit (${appWindows.length} window${appWindows.length > 1 ? "s" : ""})`}
          onClick={act(() => appWindows.forEach((w) => close(w.id)))}
        />
      )}
      <Divider />
      <MenuItem label="Clear Badge" onClick={act(() => setBadge(app.id, 0))} />
      <MenuItem label="Test Badge" onClick={act(() => setBadge(app.id, Math.floor(Math.random() * 20) + 1))} />
      <Divider />
      <MenuItem label="Remove from Dock" danger onClick={act(() => toggleDockPin(app.id))} />
    </div>
  );
}

function MenuItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 hover:bg-white/15 rounded-md mx-1 ${danger ? "text-red-400" : ""}`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="my-1 mx-2 h-px bg-white/15" />;
}
