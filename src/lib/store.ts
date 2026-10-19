import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { closeLine, type TagId } from "@/lib/copy";
import { dayKeyAt } from "@/lib/time";

export type Moment = {
  id: string;
  name: string;
  tag: TagId | null;
};

export type DayLog = {
  begunAt: number | null;
  intention: string;
  moments: Moment[];
  close: string | null;
};

type NoticeKind = "dawn" | "dusk" | "mid";

type Fired = Partial<Record<NoticeKind, boolean>>;

type AppState = {
  introSeen: boolean;
  dawnHour: number;
  dawnMinute: number;
  sleepHour: number;
  sleepMinute: number;
  seenAt: number | null;
  days: Record<string, DayLog>;
  notices: Record<NoticeKind, boolean>;
  dawnOfferSeen: boolean;
  fired: Record<string, Fired>;
  seeIntro: () => void;
  setDawn: (hour: number, minute: number) => void;
  setSleep: (hour: number, minute: number) => void;
  markSeen: (at: number) => void;
  saveIntention: (text: string, now?: Date) => void;
  addMoment: (name: string, tag: TagId | null, now?: Date) => boolean;
  removeMoment: (id: string, now?: Date) => void;
  closeDay: (now?: Date) => void;
  setNotice: (kind: NoticeKind, on: boolean) => void;
  dismissDawnOffer: () => void;
  markFired: (key: string, kind: NoticeKind) => void;
  replayIntro: () => void;
};

const emptyLog = (): DayLog => ({
  begunAt: null,
  intention: "",
  moments: [],
  close: null,
});

function memoryStorage(): Storage {
  const mem = new Map<string, string>();
  return {
    getItem: (key) => mem.get(key) ?? null,
    setItem: (key, value) => {
      mem.set(key, value);
    },
    removeItem: (key) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: (index) => [...mem.keys()][index] ?? null,
    get length() {
      return mem.size;
    },
  };
}

export function logFor(days: Record<string, DayLog>, key: string): DayLog {
  return days[key] ?? emptyLog();
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      introSeen: false,
      dawnHour: 6,
      dawnMinute: 0,
      sleepHour: 23,
      sleepMinute: 0,
      seenAt: null,
      days: {},
      notices: { dawn: false, dusk: false, mid: false },
      dawnOfferSeen: false,
      fired: {},
      seeIntro: () => set({ introSeen: true }),
      replayIntro: () => set({ introSeen: false }),
      setDawn: (hour, minute) => set({ dawnHour: hour, dawnMinute: minute }),
      setSleep: (hour, minute) => set({ sleepHour: hour, sleepMinute: minute }),
      markSeen: (at) => set({ seenAt: at }),
      dismissDawnOffer: () => set({ dawnOfferSeen: true }),
      setNotice: (kind, on) =>
        set({ notices: { ...get().notices, [kind]: on } }),
      markFired: (key, kind) => {
        const prev = get().fired[key] ?? {};
        set({ fired: { ...get().fired, [key]: { ...prev, [kind]: true } } });
      },
      saveIntention: (text, now = new Date()) => {
        const intention = text.trim().slice(0, 80);
        if (!intention) return;
        const { dawnHour, dawnMinute, days } = get();
        const key = dayKeyAt(now, dawnHour, dawnMinute);
        const current = logFor(days, key);
        set({
          days: {
            ...days,
            [key]: {
              ...current,
              intention,
              begunAt: current.begunAt ?? now.getTime(),
            },
          },
        });
      },
      addMoment: (name, tag, now = new Date()) => {
        const cleaned = name.trim().slice(0, 80);
        if (!cleaned) return false;
        const { dawnHour, dawnMinute, days } = get();
        const key = dayKeyAt(now, dawnHour, dawnMinute);
        const current = logFor(days, key);
        if (current.moments.length >= 12) return false;
        const moment: Moment = {
          id: crypto.randomUUID(),
          name: cleaned,
          tag,
        };
        set({
          days: {
            ...days,
            [key]: {
              ...current,
              begunAt: current.begunAt ?? now.getTime(),
              moments: [moment, ...current.moments],
              close: null,
            },
          },
        });
        return true;
      },
      removeMoment: (id, now = new Date()) => {
        const { dawnHour, dawnMinute, days } = get();
        const key = dayKeyAt(now, dawnHour, dawnMinute);
        const current = logFor(days, key);
        set({
          days: {
            ...days,
            [key]: {
              ...current,
              moments: current.moments.filter((moment) => moment.id !== id),
              close: null,
            },
          },
        });
      },
      closeDay: (now = new Date()) => {
        const { dawnHour, dawnMinute, days } = get();
        const key = dayKeyAt(now, dawnHour, dawnMinute);
        const current = logFor(days, key);
        set({
          days: {
            ...days,
            [key]: { ...current, close: closeLine(current.moments) },
          },
        });
      },
    }),
    {
      name: "morrow",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage() : localStorage,
      ),
      skipHydration: true,
      version: 2,
      migrate: (persisted, version) => {
        if (version >= 2) return persisted as AppState;
        const state = persisted as Partial<AppState>;
        const notices = state.notices;
        return {
          ...state,
          sleepHour: 23,
          sleepMinute: 0,
          seenAt: null,
          notices: {
            dawn: notices?.dawn ?? false,
            dusk: notices?.dusk ?? false,
            mid: notices?.mid ?? false,
          },
        } as AppState;
      },
    },
  ),
);

type BootState = {
  ready: boolean;
  banner: string | null;
  setReady: (ready: boolean) => void;
  showBanner: (banner: string) => void;
  clearBanner: () => void;
};

export const useBoot = create<BootState>((set) => ({
  ready: false,
  banner: null,
  setReady: (ready) => set({ ready }),
  showBanner: (banner) => set({ banner }),
  clearBanner: () => set({ banner: null }),
}));
