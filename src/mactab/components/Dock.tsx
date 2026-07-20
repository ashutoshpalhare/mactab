import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useStore } from "../store";
import { useWindows } from "../windows";
import { APPS, type AppDef, preloadApp } from "../apps";
import { DynamicClockIcon, DynamicWeatherIcon } from "./DynamicIcons";

const SIZE_MAP = {
  small: { base: 40, gap: 4, pad: 6 },
  medium: { base: 52, gap: 6, pad: 8 },
  large: { base: 64, gap: 8, pad: 10 },
} as const;

// Gaussian magnification curve — matches macOS feel much better than linear
function magScale(distance: number, sigma: number, maxScale: number) {
  const g = Math.exp(-(distance * distance) / (2 * sigma * sigma));
  return 1 + (maxScale - 1) * g;
}

export function Dock() {
  const dockPosition = useStore((s) => s.dockPosition);
  const autoHide = useStore((s) => s.dockAutoHide);
  const magnify = useStore((s) => s.dockMagnification);
  const magLevel = useStore((s) => s.dockMagnificationLevel);
  const dockSize = useStore((s) => s.dockSize);
  const showRecents = useStore((s) => s.dockShowRecents);
  const recentApps = useStore((s) => s.recentApps);
  const pushRecentApp = useStore((s) => s.pushRecentApp);
  const dockHidden = useStore((s) => s.dockHidden);
  const badges = useStore((s) => s.badges);
  const open = useWindows((s) => s.open);
  const windows = useWindows((s) => s.windows);
  const [hidden, setHidden] = useState(autoHide);
  const [menu, setMenu] = useState<{ app: AppDef; x: number; y: number } | null>(null);

  const { base, gap, pad } = SIZE_MAP[dockSize];
  const maxScale = 1 + 0.7 * magLevel; // 1.35x .. 2.4x
  const sigma = base * 1.4; // controls "spread" of neighbors

  const rawMouse = useMotionValue<number>(Infinity);
  // Smooth the cursor position itself for buttery neighbor movement
  const mouse = useSpring(rawMouse, { stiffness: 700, damping: 40, mass: 0.6 });

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
  const pinnedIds = new Set(pinned.map((a) => a.id));
  const recents = showRecents
    ? (recentApps
        .filter((id) => !pinnedIds.has(id))
        .map((id) => APPS.find((a) => a.id === id))
        .filter(Boolean) as AppDef[])
    : [];
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

  const handleOpen = (id: string) => {
    open(id);
    pushRecentApp(id);
  };

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
        onMouseLeave={() => rawMouse.set(Infinity)}
      >
        <div
          className={`dock-surface flex items-end rounded-[26px] ${
            isVertical ? "flex-col items-center" : ""
          }`}
          style={{
            padding: pad,
            gap,
          }}
          onMouseMove={(e) => rawMouse.set(isVertical ? e.clientY : e.clientX)}
        >
          {pinned.map((app) => (
            <DockIcon
              key={app.id}
              app={app}
              mouse={mouse}
              base={base}
              maxScale={magnify ? maxScale : 1}
              sigma={sigma}
              vertical={isVertical}
              running={running.has(app.id)}
              badge={badges[app.id] ?? 0}
              onClick={() => handleOpen(app.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu({ app, x: e.clientX, y: e.clientY });
              }}
            />
          ))}
          {recents.length > 0 && (
            <>
              <div
                className="bg-white/25 rounded-full"
                style={
                  isVertical
                    ? { height: 1, width: base * 0.6, margin: "4px 0" }
                    : { width: 1, height: base * 0.6, margin: "0 4px" }
                }
              />
              {recents.map((app) => (
                <DockIcon
                  key={`r-${app.id}`}
                  app={app}
                  mouse={mouse}
                  base={base}
                  maxScale={magnify ? maxScale : 1}
                  sigma={sigma}
                  vertical={isVertical}
                  running={running.has(app.id)}
                  badge={badges[app.id] ?? 0}
                  onClick={() => handleOpen(app.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenu({ app, x: e.clientX, y: e.clientY });
                  }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>
      {menu && <DockContextMenu {...menu} onClose={() => setMenu(null)} />}
    </>
  );
}

function DockIcon({
  app,
  mouse,
  base,
  maxScale,
  sigma,
  vertical,
  running,
  badge,
  onClick,
  onContextMenu,
}: {
  app: AppDef;
  mouse: MotionValue<number>;
  base: number;
  maxScale: number;
  sigma: number;
  vertical: boolean;
  running: boolean;
  badge: number;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const sizeRaw = useTransform<number, number>(mouse, (v) => {
    if (v === Infinity || maxScale === 1) return base;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return base;
    const center = vertical ? r.top + r.height / 2 : r.left + r.width / 2;
    const distance = v - center;
    return base * magScale(distance, sigma, maxScale);
  });

  // Per-icon spring smooths the size to feel elastic and bouncy
  const size = useSpring(sizeRaw, { stiffness: 500, damping: 32, mass: 0.4 });

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
          width: maxScale === 1 ? base : size,
          height: maxScale === 1 ? base : size,
        }}
        whileTap={{ scale: 0.85, transition: { type: "spring", stiffness: 600, damping: 15 } }}
        title={app.name}
      >
        <div
          className="w-full h-full rounded-[22%] flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              app.id === "clock"
                ? "linear-gradient(135deg,#f8fafc,#cbd5e1)"
                : `linear-gradient(135deg, ${app.color}, ${app.color}cc)`,
            boxShadow: `0 8px 20px ${app.color}55, inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.2)`,
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
          running ? "bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" : "bg-transparent"
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
