import { cacheData, getCachedData } from "@/utils/storage";

export const TMDB_CONFIG = {
    BASE_URL: "https://api.themoviedb.org/3",
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    },
};

/**
 * Fetch movies with offline-first caching strategy.
 * 1. Check AsyncStorage cache → return if valid
 * 2. Fetch from TMDB API → update cache
 * 3. On network failure, return stale cache as fallback
 */
export const fetchMovies = async ({
    query,
}: {
    query: string;
}): Promise<Movie[]> => {
    const cacheKey = `movies_${query || "discover"}`;

    // Step 1: Check cache first (offline-first)
    const cached = await getCachedData<Movie[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Step 2: Fetch from network
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
              query
          )}`
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    try {
        const res = await fetch(endpoint, {
            method: "GET",
            headers: TMDB_CONFIG.headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch movies: ${res.statusText}`);
        }

        const data = await res.json();
        const movies: Movie[] = data.results;

        // Step 3: Cache the response for offline access
        await cacheData(cacheKey, movies);

        return movies;
    } catch (error) {
        // Step 4: On network error, try returning stale cache as fallback
        const staleCache = await getCachedData<Movie[]>(cacheKey);
        if (staleCache) {
            console.warn("[API] Using stale cache as fallback");
            return staleCache;
        }

        throw error instanceof Error
            ? error
            : new Error("An unexpected error occurred while fetching movies");
    }
};

/**
 * Fetch detailed movie information with caching.
 */
export const fetchMovieDetails = async (
    movieId: string
): Promise<MovieDetails> => {
    const cacheKey = `movie_details_${movieId}`;

    // Check cache first
    const cached = await getCachedData<MovieDetails>(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
            {
                method: "GET",
                headers: TMDB_CONFIG.headers,
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch movie details: ${response.statusText}`
            );
        }

        const data: MovieDetails = await response.json();

        // Cache for offline access (longer TTL for details — 1 hour)
        await cacheData(cacheKey, data, 60 * 60 * 1000);

        return data;
    } catch (error) {
        // Fallback to stale cache
        const staleCache = await getCachedData<MovieDetails>(cacheKey);
        if (staleCache) {
            console.warn("[API] Using stale cache for movie details");
            return staleCache;
        }

        console.error("Error fetching movie details:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to fetch movie details");
    }
};
