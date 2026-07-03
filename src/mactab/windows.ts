import { create } from "zustand";
import { APPS } from "./apps";

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

interface WindowsStore {
  windows: WindowState[];
  topZ: number;
  open: (appId: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  update: (id: string, patch: Partial<WindowState>) => void;
  toggleMax: (id: string) => void;
  minimize: (id: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useWindows = create<WindowsStore>((set, get) => ({
  windows: [],
  topZ: 10,
  open: (appId) => {
    const app = APPS.find((a) => a.id === appId);
    if (!app || !app.component) return;
    const existing = get().windows.find((w) => w.appId === appId);
    if (existing) {
      get().focus(existing.id);
      if (existing.minimized) get().update(existing.id, { minimized: false });
      return;
    }
    const w = app.width ?? 720;
    const h = app.height ?? 520;
    const cx = Math.max(20, (window.innerWidth - w) / 2 + (Math.random() - 0.5) * 60);
    const cy = Math.max(40, (window.innerHeight - h) / 2 - 40 + (Math.random() - 0.5) * 40);
    const z = get().topZ + 1;
    set((s) => ({
      topZ: z,
      windows: [
        ...s.windows,
        {
          id: uid(),
          appId,
          title: app.name,
          x: cx,
          y: cy,
          w,
          h,
          z,
          minimized: false,
          maximized: false,
        },
      ],
    }));
  },
  close: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
  focus: (id) => {
    const z = get().topZ + 1;
    set((s) => ({
      topZ: z,
      windows: s.windows.map((w) => (w.id === id ? { ...w, z } : w)),
    }));
  },
  update: (id, patch) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, ...patch } : w)) })),
  toggleMax: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    })),
  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    })),
}));
