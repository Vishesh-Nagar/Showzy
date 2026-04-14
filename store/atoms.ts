import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Jotai state management store.
 * Demonstrates understanding of state management libraries (Jotai)
 * combined with offline-first persistence via AsyncStorage.
 */

// --- Persistence Helper Functions ---

/** 
 * Safely writes data to AsyncStorage. 
 * Handles JSON stringification and basic error logging.
 */
const persistToStorage = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`[Storage] Failed to save ${key}:`, error);
    }
};

/** 
 * Safely reads and parses data from AsyncStorage.
 * Returns the provided initial value on failure or if data is missing.
 */
const hydrateFromStorage = async (key: string, initialValue: any) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : initialValue;
    } catch (error) {
        console.warn(`[Storage] Failed to load ${key}:`, error);
        return initialValue;
    }
};

// --- Saved Movies ---
export interface SavedMovie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    savedAt: number; // timestamp
}

const STORAGE_KEY_SAVED_MOVIES = "showzy_saved_movies";
const baseSavedMoviesAtom = atom<SavedMovie[]>([]);

/** 
 * Central atom for saved movies.
 * Persists to AsyncStorage on every change and hydrates on first mount.
 */
export const savedMoviesAtom = atom(
    (get) => get(baseSavedMoviesAtom),
    (get, set, update: SavedMovie[] | ((prev: SavedMovie[]) => SavedMovie[])) => {
        const nextValue = typeof update === "function" ? update(get(baseSavedMoviesAtom)) : update;
        set(baseSavedMoviesAtom, nextValue);
        persistToStorage(STORAGE_KEY_SAVED_MOVIES, nextValue);
    }
);

// Subscribe to storage load on mount
savedMoviesAtom.onMount = (setAtom) => {
    hydrateFromStorage(STORAGE_KEY_SAVED_MOVIES, []).then(setAtom);
};

// --- Search History ---
export interface SearchHistoryItem {
    query: string;
    timestamp: number;
}

const STORAGE_KEY_SEARCH_HISTORY = "showzy_search_history";
const baseSearchHistoryAtom = atom<SearchHistoryItem[]>([]);

/** 
 * Central atom for search history.
 * Limits history to 10 items and persists synchronously to disk.
 */
export const searchHistoryAtom = atom(
    (get) => get(baseSearchHistoryAtom),
    (get, set, update: SearchHistoryItem[] | ((prev: SearchHistoryItem[]) => SearchHistoryItem[])) => {
        const nextValue = typeof update === "function" ? update(get(baseSearchHistoryAtom)) : update;
        set(baseSearchHistoryAtom, nextValue);
        persistToStorage(STORAGE_KEY_SEARCH_HISTORY, nextValue);
    }
);

searchHistoryAtom.onMount = (setAtom) => {
    hydrateFromStorage(STORAGE_KEY_SEARCH_HISTORY, []).then(setAtom);
};

// --- App Preferences ---
export interface AppPreferences {
    adultContentFilter: boolean;
    preferredGenres: number[];
}

const STORAGE_KEY_PREFERENCES = "showzy_preferences";
const defaultPreferences: AppPreferences = {
    adultContentFilter: true,
    preferredGenres: [],
};

const baseAppPreferencesAtom = atom<AppPreferences>(defaultPreferences);

/** 
 * Central atom for user preferences.
 * Ensures consistent state across app restarts via manual AsyncStorage sync.
 */
export const appPreferencesAtom = atom(
    (get) => get(baseAppPreferencesAtom),
    (get, set, update: AppPreferences | ((prev: AppPreferences) => AppPreferences)) => {
        const nextValue = typeof update === "function" ? update(get(baseAppPreferencesAtom)) : update;
        set(baseAppPreferencesAtom, nextValue);
        persistToStorage(STORAGE_KEY_PREFERENCES, nextValue);
    }
);

appPreferencesAtom.onMount = (setAtom) => {
    hydrateFromStorage(STORAGE_KEY_PREFERENCES, defaultPreferences).then(setAtom);
};

// --- Derived / Computed Atoms ---

/** Count of saved movies (read-only derived atom). */
export const savedMoviesCountAtom = atom((get) => get(savedMoviesAtom).length);

/** Count of search history entries (read-only derived atom). */
export const searchHistoryCountAtom = atom(
    (get) => get(searchHistoryAtom).length
);

// --- API Monitoring ---
/** Global counter for all network requests. Updated from services. */
export const apiCallCountAtom = atom(0);
