import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WallpaperId =
  | "sonoma"
  | "sequoia"
  | "monterey"
  | "aurora"
  | "sunset"
  | "midnight"
  | "mint";

export const WALLPAPERS: Record<WallpaperId, { name: string; gradient: string }> = {
  sonoma: {
    name: "Sonoma",
    gradient:
      "radial-gradient(at 20% 20%, #ff9a8b 0%, transparent 50%), radial-gradient(at 80% 0%, #a18cd1 0%, transparent 50%), radial-gradient(at 80% 80%, #fbc2eb 0%, transparent 50%), radial-gradient(at 0% 100%, #667eea 0%, transparent 50%), linear-gradient(135deg, #f093fb 0%, #4f46e5 100%)",
  },
  sequoia: {
    name: "Sequoia",
    gradient:
      "radial-gradient(at 30% 20%, #4facfe 0%, transparent 50%), radial-gradient(at 70% 60%, #00f2fe 0%, transparent 50%), linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },
  monterey: {
    name: "Monterey",
    gradient:
      "radial-gradient(at 50% 30%, #ff6a88 0%, transparent 60%), radial-gradient(at 20% 80%, #ff99ac 0%, transparent 50%), linear-gradient(180deg, #3a0ca3 0%, #7209b7 100%)",
  },
  aurora: {
    name: "Aurora",
    gradient:
      "radial-gradient(at 20% 0%, #00d2ff 0%, transparent 50%), radial-gradient(at 80% 100%, #3a7bd5 0%, transparent 50%), linear-gradient(135deg, #06beb6 0%, #48b1bf 100%)",
  },
  sunset: {
    name: "Sunset",
    gradient:
      "radial-gradient(at 0% 100%, #ff512f 0%, transparent 50%), radial-gradient(at 100% 0%, #f09819 0%, transparent 50%), linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
  },
  midnight: {
    name: "Midnight",
    gradient:
      "radial-gradient(at 30% 30%, #232526 0%, transparent 50%), radial-gradient(at 70% 70%, #414345 0%, transparent 50%), linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  },
  mint: {
    name: "Mint",
    gradient:
      "radial-gradient(at 20% 20%, #a8edea 0%, transparent 50%), radial-gradient(at 80% 80%, #fed6e3 0%, transparent 50%), linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
};

export type Theme = "light" | "dark" | "auto";

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  updatedAt: number;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: "low" | "med" | "high";
  createdAt: number;
}

export interface SpeedDial {
  id: string;
  name: string;
  url: string;
  color: string;
}

export interface WidgetState {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

interface State {
  theme: Theme;
  wallpaper: WallpaperId;
  animatedWallpaper: boolean;
  accent: string;
  dockPosition: "bottom" | "left" | "right";
  dockAutoHide: boolean;
  dockHidden: string[];
  dockMagnification: boolean;
  dockSoundEnabled: boolean;
  badges: Record<string, number>;
  notes: Note[];
  stickies: StickyNote[];
  todos: Todo[];
  speedDials: SpeedDial[];
  widgets: Record<string, WidgetState>;
  clipboard: { id: string; text: string; at: number }[];
  setTheme: (t: Theme) => void;
  setWallpaper: (w: WallpaperId) => void;
  toggleAnimatedWallpaper: () => void;
  setDockPosition: (p: "bottom" | "left" | "right") => void;
  toggleDockAutoHide: () => void;
  toggleDockMagnification: () => void;
  toggleDockSound: () => void;
  toggleDockPin: (appId: string) => void;
  setBadge: (appId: string, count: number) => void;
  addNote: () => string;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addSticky: () => void;
  updateSticky: (id: string, patch: Partial<StickyNote>) => void;
  deleteSticky: (id: string) => void;
  addTodo: (text: string, priority?: Todo["priority"]) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addSpeedDial: (name: string, url: string) => void;
  deleteSpeedDial: (id: string) => void;
  setWidget: (id: string, patch: Partial<WidgetState>) => void;
  pushClipboard: (text: string) => void;
}


const uid = () => Math.random().toString(36).slice(2, 10);

const stickyColors = ["#fde68a", "#fca5a5", "#a7f3d0", "#bfdbfe", "#f5d0fe"];

export const useStore = create<State>()(
  persist(
    (set) => ({
      theme: "auto",
      wallpaper: "sonoma",
      animatedWallpaper: true,
      accent: "#5b6cff",
      dockPosition: "bottom",
      dockAutoHide: false,
      notes: [
        {
          id: uid(),
          title: "Welcome to MacTab OS",
          content:
            "This is your new tab dashboard.\n\n• Press ⌃ Space for Spotlight\n• Drag widgets to move them\n• Right-click the dock to customize",
          color: "#fde68a",
          updatedAt: Date.now(),
        },
      ],
      stickies: [],
      todos: [
        { id: uid(), text: "Explore MacTab OS", done: false, priority: "med", createdAt: Date.now() },
      ],
      speedDials: [
        { id: uid(), name: "GitHub", url: "https://github.com", color: "#0d1117" },
        { id: uid(), name: "YouTube", url: "https://youtube.com", color: "#ff0033" },
        { id: uid(), name: "Twitter", url: "https://twitter.com", color: "#1da1f2" },
        { id: uid(), name: "Reddit", url: "https://reddit.com", color: "#ff4500" },
        { id: uid(), name: "Hacker News", url: "https://news.ycombinator.com", color: "#ff6600" },
        { id: uid(), name: "Notion", url: "https://notion.so", color: "#000000" },
      ],
      widgets: {
        clock: { id: "clock", x: 40, y: 60, visible: true },
        weather: { id: "weather", x: 40, y: 260, visible: true },
        calendar: { id: "calendar", x: 40, y: 460, visible: true },
        quote: { id: "quote", x: 320, y: 60, visible: true },
        todos: { id: "todos", x: 320, y: 200, visible: true },
        system: { id: "system", x: 320, y: 460, visible: true },
      },
      clipboard: [],

      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      toggleAnimatedWallpaper: () =>
        set((s) => ({ animatedWallpaper: !s.animatedWallpaper })),
      setDockPosition: (dockPosition) => set({ dockPosition }),
      toggleDockAutoHide: () => set((s) => ({ dockAutoHide: !s.dockAutoHide })),

      addNote: () => {
        const id = uid();
        set((s) => ({
          notes: [
            { id, title: "Untitled", content: "", color: "#fde68a", updatedAt: Date.now() },
            ...s.notes,
          ],
        }));
        return id;
      },
      updateNote: (id, patch) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
        })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      addSticky: () =>
        set((s) => ({
          stickies: [
            ...s.stickies,
            {
              id: uid(),
              text: "",
              color: stickyColors[s.stickies.length % stickyColors.length],
              x: 200 + s.stickies.length * 30,
              y: 200 + s.stickies.length * 30,
              w: 220,
              h: 200,
            },
          ],
        })),
      updateSticky: (id, patch) =>
        set((s) => ({
          stickies: s.stickies.map((n) => (n.id === id ? { ...n, ...patch } : n)),
        })),
      deleteSticky: (id) =>
        set((s) => ({ stickies: s.stickies.filter((n) => n.id !== id) })),

      addTodo: (text, priority = "med") =>
        set((s) => ({
          todos: [
            { id: uid(), text, done: false, priority, createdAt: Date.now() },
            ...s.todos,
          ],
        })),
      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      deleteTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      addSpeedDial: (name, url) =>
        set((s) => ({
          speedDials: [
            ...s.speedDials,
            { id: uid(), name, url, color: "#" + Math.floor(Math.random() * 16777215).toString(16) },
          ],
        })),
      deleteSpeedDial: (id) =>
        set((s) => ({ speedDials: s.speedDials.filter((d) => d.id !== id) })),

      setWidget: (id, patch) =>
        set((s) => ({
          widgets: { ...s.widgets, [id]: { ...s.widgets[id], ...patch } },
        })),
      pushClipboard: (text) =>
        set((s) => ({
          clipboard: [{ id: uid(), text, at: Date.now() }, ...s.clipboard].slice(0, 50),
        })),
    }),
    { name: "mactab-os" },
  ),
);
