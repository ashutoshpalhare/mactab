import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Calendar,
  Clock,
  FileText,
  Folder,
  Trash2,
  Settings,
  StickyNote,
  Timer,
  ClipboardList,
  Music,
  CheckSquare,
  Cloud,
  Search,
  Sparkles,
  Chrome,
  Grid3x3,
  Wrench,
} from "lucide-react";
import { lazy } from "react";

const loaders: Record<string, () => Promise<unknown>> = {
  notes: () => import("./apps/NotesApp"),
  calculator: () => import("./apps/CalculatorApp"),
  calendar: () => import("./apps/CalendarApp"),
  clock: () => import("./apps/ClockApp"),
  pomodoro: () => import("./apps/PomodoroApp"),
  settings: () => import("./apps/SettingsApp"),
  speeddial: () => import("./apps/SpeedDialApp"),
  finder: () => import("./apps/SpeedDialApp"),
  todos: () => import("./apps/TodosApp"),
  weather: () => import("./apps/WeatherApp"),
  clipboard: () => import("./apps/ClipboardApp"),
  music: () => import("./apps/MusicApp"),
  ai: () => import("./apps/AIHubApp"),
  google: () => import("./apps/GoogleAppsApp"),
  utilities: () => import("./apps/UtilitiesApp"),
  trash: () => import("./apps/TrashApp"),
};

export function preloadApp(id: string) {
  loaders[id]?.();
}

const NotesApp = lazy(loaders.notes as () => Promise<{ default: React.ComponentType }>);
const CalculatorApp = lazy(loaders.calculator as () => Promise<{ default: React.ComponentType }>);
const CalendarApp = lazy(loaders.calendar as () => Promise<{ default: React.ComponentType }>);
const ClockApp = lazy(loaders.clock as () => Promise<{ default: React.ComponentType }>);
const PomodoroApp = lazy(loaders.pomodoro as () => Promise<{ default: React.ComponentType }>);
const SettingsApp = lazy(loaders.settings as () => Promise<{ default: React.ComponentType }>);
const SpeedDialApp = lazy(loaders.speeddial as () => Promise<{ default: React.ComponentType }>);
const TodosApp = lazy(loaders.todos as () => Promise<{ default: React.ComponentType }>);
const WeatherApp = lazy(loaders.weather as () => Promise<{ default: React.ComponentType }>);
const ClipboardApp = lazy(loaders.clipboard as () => Promise<{ default: React.ComponentType }>);
const MusicApp = lazy(loaders.music as () => Promise<{ default: React.ComponentType }>);
const AIHubApp = lazy(loaders.ai as () => Promise<{ default: React.ComponentType }>);
const GoogleAppsApp = lazy(loaders.google as () => Promise<{ default: React.ComponentType }>);
const UtilitiesApp = lazy(loaders.utilities as () => Promise<{ default: React.ComponentType }>);
const TrashApp = lazy(loaders.trash as () => Promise<{ default: React.ComponentType }>);


export interface AppDef {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  component?: React.ComponentType;
  width?: number;
  height?: number;
  pinned?: boolean;
}

export const APPS: AppDef[] = [
  { id: "finder", name: "Finder", icon: Folder, color: "#4a90e2", component: SpeedDialApp, pinned: true, width: 900, height: 600 },
  { id: "speeddial", name: "Speed Dial", icon: Grid3x3, color: "#0ea5e9", component: SpeedDialApp, pinned: true, width: 900, height: 600 },
  { id: "notes", name: "Notes", icon: FileText, color: "#facc15", component: NotesApp, pinned: true, width: 900, height: 600 },
  { id: "calendar", name: "Calendar", icon: Calendar, color: "#ef4444", component: CalendarApp, pinned: true, width: 800, height: 600 },
  { id: "todos", name: "Reminders", icon: CheckSquare, color: "#a855f7", component: TodosApp, pinned: true, width: 640, height: 640 },
  { id: "clock", name: "Clock", icon: Clock, color: "#111827", component: ClockApp, pinned: true, width: 720, height: 520 },
  { id: "weather", name: "Weather", icon: Cloud, color: "#38bdf8", component: WeatherApp, pinned: true, width: 720, height: 520 },
  { id: "calculator", name: "Calculator", icon: Calculator, color: "#1f2937", component: CalculatorApp, pinned: true, width: 340, height: 500 },
  { id: "clipboard", name: "Clipboard", icon: ClipboardList, color: "#10b981", component: ClipboardApp, pinned: true, width: 600, height: 600 },
  { id: "pomodoro", name: "Pomodoro", icon: Timer, color: "#f97316", component: PomodoroApp, pinned: true, width: 480, height: 600 },
  { id: "music", name: "Music", icon: Music, color: "#ec4899", component: MusicApp, pinned: true, width: 520, height: 620 },
  { id: "ai", name: "AI Hub", icon: Sparkles, color: "#8b5cf6", component: AIHubApp, pinned: true, width: 780, height: 560 },
  { id: "google", name: "Google", icon: Chrome, color: "#4285f4", component: GoogleAppsApp, pinned: true, width: 780, height: 560 },
  { id: "utilities", name: "Utilities", icon: Wrench, color: "#64748b", component: UtilitiesApp, pinned: true, width: 820, height: 620 },
  { id: "stickies", name: "Sticky Notes", icon: StickyNote, color: "#fbbf24", pinned: false, width: 0, height: 0 },
  { id: "settings", name: "Settings", icon: Settings, color: "#6b7280", component: SettingsApp, pinned: true, width: 760, height: 600 },
  { id: "trash", name: "Trash", icon: Trash2, color: "#9ca3af", component: TrashApp, pinned: true, width: 640, height: 480 },
];

export const SPOTLIGHT_META = { icon: Search };
