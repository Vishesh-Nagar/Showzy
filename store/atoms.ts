import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Jotai state management store.
 * Demonstrates understanding of state management libraries (Jotai)
 * combined with offline-first persistence via AsyncStorage.
 */

// --- AsyncStorage adapter for Jotai ---
const asyncStorageAdapter = createJSONStorage<any>(() => ({
    getItem: async (key: string) => {
        const value = await AsyncStorage.getItem(key);
        return value;
    },
    setItem: async (key: string, value: string) => {
        await AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        await AsyncStorage.removeItem(key);
    },
}));

// --- Saved Movies ---
export interface SavedMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    savedAt: number; // timestamp
}

/** Persisted atom for bookmarked/saved movies. Survives app restarts. */
const savedMoviesBaseAtom = atomWithStorage<SavedMovie[]>(
    "showzy_saved_movies",
    [],
    asyncStorageAdapter as any,
);

/** Unwrapped atom that always resolves to SavedMovie[] */
export const savedMoviesAtom = atom(
    (get) => {
        const val = get(savedMoviesBaseAtom);
        if (val instanceof Promise) return [] as SavedMovie[];
        return val;
    },
    (_get, set, update: SavedMovie[] | ((prev: SavedMovie[]) => SavedMovie[])) => {
        if (typeof update === "function") {
            const current = _get(savedMoviesBaseAtom);
            const resolved = current instanceof Promise ? [] : current;
            set(savedMoviesBaseAtom, update(resolved));
        } else {
            set(savedMoviesBaseAtom, update);
        }
    }
);

// --- Search History ---
export interface SearchHistoryItem {
    query: string;
    timestamp: number;
}

/** Persisted atom for recent search history (max 10 items). */
const searchHistoryBaseAtom = atomWithStorage<SearchHistoryItem[]>(
    "showzy_search_history",
    [],
    asyncStorageAdapter as any,
);

/** Unwrapped atom that always resolves to SearchHistoryItem[] */
export const searchHistoryAtom = atom(
    (get) => {
        const val = get(searchHistoryBaseAtom);
        if (val instanceof Promise) return [] as SearchHistoryItem[];
        return val;
    },
    (_get, set, update: SearchHistoryItem[] | ((prev: SearchHistoryItem[]) => SearchHistoryItem[])) => {
        if (typeof update === "function") {
            const current = _get(searchHistoryBaseAtom);
            const resolved = current instanceof Promise ? [] : current;
            set(searchHistoryBaseAtom, update(resolved));
        } else {
            set(searchHistoryBaseAtom, update);
        }
    }
);

// --- App Preferences ---
export interface AppPreferences {
    adultContentFilter: boolean;
    preferredGenres: number[];
}

const defaultPreferences: AppPreferences = {
    adultContentFilter: true,
    preferredGenres: [],
};

/** Persisted atom for user preferences. */
const appPreferencesBaseAtom = atomWithStorage<AppPreferences>(
    "showzy_preferences",
    defaultPreferences,
    asyncStorageAdapter as any,
);

/** Unwrapped atom that always resolves to AppPreferences */
export const appPreferencesAtom = atom(
    (get) => {
        const val = get(appPreferencesBaseAtom);
        if (val instanceof Promise) return defaultPreferences;
        return val;
    },
    (_get, set, update: AppPreferences | ((prev: AppPreferences) => AppPreferences)) => {
        if (typeof update === "function") {
            const current = _get(appPreferencesBaseAtom);
            const resolved = current instanceof Promise ? defaultPreferences : current;
            set(appPreferencesBaseAtom, update(resolved));
        } else {
            set(appPreferencesBaseAtom, update);
        }
    }
);

// --- Derived / Computed Atoms ---

/** Count of saved movies (read-only derived atom). */
export const savedMoviesCountAtom = atom((get) => get(savedMoviesAtom).length);

/** Count of search history entries (read-only derived atom). */
export const searchHistoryCountAtom = atom(
    (get) => get(searchHistoryAtom).length
);
