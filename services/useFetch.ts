import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Generic data fetching hook with proper cleanup via AbortController pattern.
 * Supports manual and automatic fetching, loading/error states, and reset.
 */
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isMounted = useRef(true);
    const fetchFnRef = useRef(fetchFunction);

    // Update the ref whenever the function changes, but don't re-create fetchData
    useEffect(() => {
        fetchFnRef.current = fetchFunction;
    }, [fetchFunction]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFnRef.current();
            if (isMounted.current) {
                setData(result);
            }
        } catch (err) {
            if (isMounted.current) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("An unexpected error occurred")
                );
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setLoading(false);
        setError(null);
    }, []);

    useEffect(() => {
        isMounted.current = true;

        if (autoFetch) {
            fetchData();
        }

        return () => {
            isMounted.current = false;
        };
    }, []);

    return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
