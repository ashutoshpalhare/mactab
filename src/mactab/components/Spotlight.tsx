import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Globe, FileText, Calculator, Grid3x3, Sparkles } from "lucide-react";
import { useStore } from "../store";
import { useWindows } from "../windows";
import { APPS } from "../apps";

interface Result {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export function Spotlight({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindows((s) => s.open);
  const notes = useStore((s) => s.notes);
  const dials = useStore((s) => s.speedDials);
  const todos = useStore((s) => s.todos);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const query = q.trim().toLowerCase();
    const out: Result[] = [];

    // calculator
    if (/^[\d\s+\-*/().^%]+$/.test(q) && /[\d]/.test(q)) {
      try {
        // eslint-disable-next-line no-new-func
        const val = Function(`"use strict"; return (${q.replace(/\^/g, "**")})`)();
        if (typeof val === "number" && !Number.isNaN(val)) {
          out.push({
            id: "calc",
            title: String(val),
            subtitle: `= ${q}`,
            icon: <Calculator className="w-5 h-5" />,
            action: () => navigator.clipboard?.writeText(String(val)),
          });
        }
      } catch {}
    }

    if (query) {
      APPS.filter((a) => a.name.toLowerCase().includes(query)).forEach((a) =>
        out.push({
          id: `app-${a.id}`,
          title: a.name,
          subtitle: "Application",
          icon: <a.icon className="w-5 h-5" />,
          action: () => openApp(a.id),
        }),
      );
      notes
        .filter((n) => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query))
        .slice(0, 5)
        .forEach((n) =>
          out.push({
            id: `note-${n.id}`,
            title: n.title || "Untitled",
            subtitle: "Note",
            icon: <FileText className="w-5 h-5" />,
            action: () => openApp("notes"),
          }),
        );
      dials
        .filter((d) => d.name.toLowerCase().includes(query))
        .slice(0, 5)
        .forEach((d) =>
          out.push({
            id: `dial-${d.id}`,
            title: d.name,
            subtitle: d.url,
            icon: <Grid3x3 className="w-5 h-5" />,
            action: () => window.open(d.url, "_blank"),
          }),
        );
      todos
        .filter((t) => t.text.toLowerCase().includes(query))
        .slice(0, 3)
        .forEach((t) =>
          out.push({
            id: `todo-${t.id}`,
            title: t.text,
            subtitle: "Reminder",
            icon: <Sparkles className="w-5 h-5" />,
            action: () => openApp("todos"),
          }),
        );
      out.push({
        id: "google",
        title: `Search Google for "${q}"`,
        subtitle: "google.com",
        icon: <Globe className="w-5 h-5" />,
        action: () => window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank"),
      });
    } else {
      APPS.filter((a) => a.pinned)
        .slice(0, 8)
        .forEach((a) =>
          out.push({
            id: `app-${a.id}`,
            title: a.name,
            subtitle: "Application",
            icon: <a.icon className="w-5 h-5" />,
            action: () => openApp(a.id),
          }),
        );
    }
    return out;
  }, [q, notes, dials, todos, openApp]);

  useEffect(() => setSel(0), [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        results[sel]?.action();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, sel, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="glass-strong w-full max-w-2xl rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search className="w-6 h-6 opacity-70" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Spotlight Search"
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-foreground/40"
              />
              <kbd className="text-xs px-2 py-0.5 rounded bg-white/10">ESC</kbd>
            </div>
            <div className="max-h-96 overflow-y-auto no-scrollbar">
              {results.map((r, i) => (
                <button
                  key={r.id}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => {
                    r.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                    i === sel ? "bg-primary text-primary-foreground" : "hover:bg-white/5"
                  }`}
                >
                  <span className="opacity-80">{r.icon}</span>
                  <span className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium">{r.title}</div>
                    {r.subtitle && (
                      <div className={`truncate text-xs ${i === sel ? "opacity-80" : "opacity-60"}`}>
                        {r.subtitle}
                      </div>
                    )}
                  </span>
                </button>
              ))}
              {!results.length && (
                <div className="px-5 py-10 text-center text-sm opacity-60">No results</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
