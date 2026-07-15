import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStore, WALLPAPERS } from "../store";
import { useWindows } from "../windows";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Spotlight } from "./Spotlight";
import { AppWindow } from "./AppWindow";
import { ClockWidget } from "./widgets/ClockWidget";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { QuoteWidget } from "./widgets/QuoteWidget";
import { TodosWidget } from "./widgets/TodosWidget";
import { SystemWidget } from "./widgets/SystemWidget";
import { Stickies } from "./Stickies";
import { DesktopContextMenu } from "./DesktopContextMenu";

export function Desktop() {
  const wallpaper = useStore((s) => s.wallpaper);
  const animated = useStore((s) => s.animatedWallpaper);
  const theme = useStore((s) => s.theme);
  const [spotlight, setSpotlight] = useState(false);
  const windows = useWindows((s) => s.windows);
  const open = useWindows((s) => s.open);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark =
        theme === "dark" ||
        (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.code === "Space") {
        e.preventDefault();
        setSpotlight((s) => !s);
      } else if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlight(true);
      } else if (mod && e.key.toLowerCase() === "n") {
        e.preventDefault();
        open("notes");
      } else if (mod && e.key.toLowerCase() === "b") {
        e.preventDefault();
        open("speeddial");
      } else if (mod && e.key.toLowerCase() === "h") {
        e.preventDefault();
        open("clipboard");
      } else if (e.key === "Escape") {
        setSpotlight(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const wp = WALLPAPERS[wallpaper];

  return (
    <div ref={rootRef} className="fixed inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 ${animated ? "wallpaper-animated" : ""}`}
        style={{ background: wp.gradient, backgroundSize: "cover" }}
      />
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
      <MenuBar onSpotlight={() => setSpotlight(true)} />

      <div className="absolute inset-0 pt-7">
        <ClockWidget />
        <WeatherWidget />
        <CalendarWidget />
        <QuoteWidget />
        <TodosWidget />
        <SystemWidget />
        <Stickies />
      </div>

      <AnimatePresence>
        {windows.map((w) => (
          <AppWindow key={w.id} w={w} />
        ))}
      </AnimatePresence>

      <Dock />
      <Spotlight open={spotlight} onClose={() => setSpotlight(false)} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 text-white/70 text-xs backdrop-blur-md bg-black/20 px-3 py-1.5 rounded-full pointer-events-none"
      >
        Press ⌃ Space to open Spotlight
      </motion.div>
    </div>
  );
}
