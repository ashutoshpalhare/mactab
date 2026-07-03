import { WALLPAPERS, useStore, type WallpaperId } from "../store";

export default function SettingsApp() {
  const {
    theme, setTheme, wallpaper, setWallpaper, animatedWallpaper,
    toggleAnimatedWallpaper, dockPosition, setDockPosition, dockAutoHide, toggleDockAutoHide,
  } = useStore();

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <Section title="Appearance">
        <Row label="Theme">
          <div className="flex gap-2">
            {(["light","dark","auto"] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize ${theme===t?"bg-primary text-primary-foreground":"bg-white/10"}`}>{t}</button>
            ))}
          </div>
        </Row>
        <Row label="Wallpaper">
          <div className="grid grid-cols-4 gap-3">
            {(Object.keys(WALLPAPERS) as WallpaperId[]).map((id) => (
              <button key={id} onClick={() => setWallpaper(id)}
                className={`h-16 rounded-xl border-2 ${wallpaper===id?"border-primary":"border-transparent"}`}
                style={{ background: WALLPAPERS[id].gradient, backgroundSize: "cover" }}
                title={WALLPAPERS[id].name} />
            ))}
          </div>
        </Row>
        <Row label="Animated wallpaper">
          <Toggle on={animatedWallpaper} onClick={toggleAnimatedWallpaper} />
        </Row>
      </Section>
      <Section title="Dock">
        <Row label="Position">
          <div className="flex gap-2">
            {(["bottom","left","right"] as const).map((p) => (
              <button key={p} onClick={() => setDockPosition(p)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize ${dockPosition===p?"bg-primary text-primary-foreground":"bg-white/10"}`}>{p}</button>
            ))}
          </div>
        </Row>
        <Row label="Auto-hide">
          <Toggle on={dockAutoHide} onClick={toggleDockAutoHide} />
        </Row>
      </Section>
      <Section title="Shortcuts">
        <div className="text-sm grid grid-cols-2 gap-y-2 opacity-80">
          <span>Spotlight</span><kbd className="justify-self-end px-2 py-0.5 rounded bg-white/10 text-xs">⌃ Space</kbd>
          <span>Quick search</span><kbd className="justify-self-end px-2 py-0.5 rounded bg-white/10 text-xs">⌃ K</kbd>
          <span>New note</span><kbd className="justify-self-end px-2 py-0.5 rounded bg-white/10 text-xs">⌃ N</kbd>
          <span>Speed Dial</span><kbd className="justify-self-end px-2 py-0.5 rounded bg-white/10 text-xs">⌃ B</kbd>
          <span>Clipboard</span><kbd className="justify-self-end px-2 py-0.5 rounded bg-white/10 text-xs">⌃ H</kbd>
          <span>Close overlay</span><kbd className="justify-self-end px-2 py-0.5 rounded bg-white/10 text-xs">Esc</kbd>
        </div>
      </Section>
      <Section title="Data">
        <div className="flex gap-2">
          <button onClick={() => {
            const data = localStorage.getItem("mactab-os");
            const blob = new Blob([data ?? "{}"], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "mactab-backup.json"; a.click();
            URL.revokeObjectURL(url);
          }} className="px-3 py-1.5 rounded-lg bg-white/10 text-sm">Export</button>
          <button onClick={() => {
            if (confirm("Reset all MacTab OS data?")) { localStorage.removeItem("mactab-os"); location.reload(); }
          }} className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-sm">Reset</button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-widest opacity-60 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm">{label}</div>
      <div>{children}</div>
    </div>
  );
}
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-11 h-6 rounded-full p-0.5 transition ${on?"bg-primary":"bg-white/20"}`}>
      <div className={`w-5 h-5 rounded-full bg-white transition ${on?"translate-x-5":""}`} />
    </button>
  );
}
