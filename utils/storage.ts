import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "showzy_cache_";
const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CachedData<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

/**
 * Store data in AsyncStorage with a time-to-live (TTL).
 * Implements offline-first caching strategy.
 */
export const cacheData = async <T>(
    key: string,
    data: T,
    ttlMs: number = DEFAULT_TTL_MS
): Promise<void> => {
    try {
        const cacheEntry: CachedData<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttlMs,
        };
        await AsyncStorage.setItem(
            `${CACHE_PREFIX}${key}`,
            JSON.stringify(cacheEntry)
        );
    } catch (error) {
        console.warn("[Storage] Failed to cache data:", error);
    }
};

/**
 * Retrieve cached data if it exists and hasn't expired.
 * Returns null if cache miss or expired.
 */
export const getCachedData = async <T>(
    key: string
): Promise<T | null> => {
    try {
        const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (!raw) return null;

        const cached: CachedData<T> = JSON.parse(raw);
        const isExpired = Date.now() - cached.timestamp > cached.ttl;

        if (isExpired) {
            await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
            return null;
        }

        return cached.data;
    } catch (error) {
        console.warn("[Storage] Failed to read cache:", error);
        return null;
    }
};

/**
 * Clear all expired cache entries.
 * Call this periodically (e.g., on app start) to free storage.
 */
export const clearExpiredCache = async (): Promise<void> => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));

        for (const key of cacheKeys) {
            const raw = await AsyncStorage.getItem(key);
            if (!raw) continue;

            try {
                const cached: CachedData<unknown> = JSON.parse(raw);
                if (Date.now() - cached.timestamp > cached.ttl) {
                    await AsyncStorage.removeItem(key);
                }
            } catch {
                // Corrupted entry — remove it
                await AsyncStorage.removeItem(key);
            }
        }
    } catch (error) {
        console.warn("[Storage] Failed to clear expired cache:", error);
    }
};

/**
 * Clear all Showzy cache entries.
 */
export const clearAllCache = async (): Promise<void> => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
        for (const key of cacheKeys) {
            await AsyncStorage.removeItem(key);
        }
    } catch (error) {
        console.warn("[Storage] Failed to clear all cache:", error);
    }
};
