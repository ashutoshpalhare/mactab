import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Image as ImageIcon, Moon, Palette, Plus, Settings2, Sun } from "lucide-react";
import { useStore, WALLPAPERS, type WallpaperId } from "../store";
import { useWindows } from "../windows";

interface Pos {
  x: number;
  y: number;
}

export function DesktopContextMenu() {
  const [pos, setPos] = useState<Pos | null>(null);
  const [submenu, setSubmenu] = useState<"wallpaper" | null>(null);
  const setWallpaper = useStore((s) => s.setWallpaper);
  const setTheme = useStore((s) => s.setTheme);
  const theme = useStore((s) => s.theme);
  const addSticky = useStore((s) => s.addSticky);
  const open = useWindows((s) => s.open);

  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      // Only fire when the click lands on the empty desktop backdrop
      if (!el.hasAttribute("data-desktop-empty")) return;
      e.preventDefault();
      const x = Math.min(e.clientX, window.innerWidth - 240);
      const y = Math.min(e.clientY, window.innerHeight - 320);
      setPos({ x, y });
      setSubmenu(null);
    };
    const onClick = () => setPos(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPos(null);
    window.addEventListener("contextmenu", onCtx);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
    const onClick = () => setPos(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPos(null);
    window.addEventListener("contextmenu", onCtx);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.12 }}
          style={{ left: pos.x, top: pos.y }}
          className="fixed z-[110] glass-strong rounded-xl p-1.5 min-w-[220px] text-sm text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {submenu === "wallpaper" ? (
            <>
              <MenuHeader onBack={() => setSubmenu(null)}>Change Wallpaper</MenuHeader>
              <div className="grid grid-cols-3 gap-1.5 p-1.5">
                {(Object.keys(WALLPAPERS) as WallpaperId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setWallpaper(id);
                      setPos(null);
                    }}
                    className="h-14 rounded-lg border border-white/10 hover:ring-2 ring-primary transition"
                    style={{ background: WALLPAPERS[id].gradient, backgroundSize: "cover" }}
                    title={WALLPAPERS[id].name}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <Item
                icon={<Plus className="w-4 h-4" />}
                label="New Sticky Note"
                onClick={() => {
                  addSticky();
                  setPos(null);
                }}
              />
              <Item
                icon={<ImageIcon className="w-4 h-4" />}
                label="Change Wallpaper"
                onClick={() => setSubmenu("wallpaper")}
                chevron
              />
              <Item
                icon={theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                label={theme === "dark" ? "Light Mode" : "Dark Mode"}
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setPos(null);
                }}
              />
              <Divider />
              <Item
                icon={<Palette className="w-4 h-4" />}
                label="Personalize"
                onClick={() => {
                  open("settings");
                  setPos(null);
                }}
              />
              <Item
                icon={<Settings2 className="w-4 h-4" />}
                label="Settings"
                onClick={() => {
                  open("settings");
                  setPos(null);
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Item({
  icon,
  label,
  onClick,
  chevron,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  chevron?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground text-left"
    >
      <span className="opacity-80">{icon}</span>
      <span className="flex-1">{label}</span>
      {chevron && <span className="opacity-60">›</span>}
    </button>
  );
}

function Divider() {
  return <div className="my-1 mx-2 h-px bg-white/10" />;
}

function MenuHeader({ children, onBack }: { children: React.ReactNode; onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
    >
      <span>‹</span> {children}
    </button>
  );
}
