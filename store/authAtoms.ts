import { atom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Authentication state atoms.
 * Stores Google OAuth user profile and persists login state via AsyncStorage.
 */

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    photo: string | null;
    givenName: string | null;
    familyName: string | null;
}

const STORAGE_KEY_AUTH = "showzy_auth_user";

// --- Persistence helpers ---
const persistAuth = async (user: AuthUser | null) => {
    try {
        if (user) {
            await AsyncStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
        } else {
            await AsyncStorage.removeItem(STORAGE_KEY_AUTH);
        }
    } catch (error) {
        console.warn("[Auth] Failed to persist auth state:", error);
    }
};

const hydrateAuth = async (): Promise<AuthUser | null> => {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEY_AUTH);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.warn("[Auth] Failed to hydrate auth state:", error);
        return null;
    }
};

// --- Auth Atoms ---
const baseAuthUserAtom = atom<AuthUser | null>(null);

/** 
 * Central auth atom. Null means logged out, AuthUser object means logged in.
 * Automatically persists to AsyncStorage on every change.
 */
export const authUserAtom = atom(
    (get) => get(baseAuthUserAtom),
    (_get, set, update: AuthUser | null) => {
        set(baseAuthUserAtom, update);
        persistAuth(update);
    }
);

// Hydrate on mount
authUserAtom.onMount = (setAtom) => {
    hydrateAuth().then(setAtom);
};

/** Derived atom: true if user is logged in */
export const isAuthenticatedAtom = atom((get) => get(authUserAtom) !== null);

/** Loading state for auth operations */
export const authLoadingAtom = atom(false);
