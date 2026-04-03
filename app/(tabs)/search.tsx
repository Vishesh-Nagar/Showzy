import { View, Text, Image, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import { updateSearchCount } from "@/services/appwrite";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { SearchResultsSkeleton } from "@/components/SkeletonLoader";
import { hapticLight } from "@/utils/haptics";

const MAX_HISTORY_ITEMS = 10;

const Search: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [, setHistory] = useAtom(searchHistoryAtom);

    const {
        data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(
        () =>
            fetchMovies({
                query: searchQuery,
            }),
        false
    );

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, loadMovies, reset]);

    // Track search count in Appwrite + save to local history
    useEffect(() => {
        if (movies && movies.length > 0 && movies[0] && searchQuery.trim()) {
            updateSearchCount(searchQuery, movies[0]);

            // Save to local search history (Jotai + AsyncStorage)
            const newItem = {
                query: searchQuery.trim(),
                timestamp: Date.now(),
            };

            setHistory((prev) => {
                // Remove duplicate if exists
                const filtered = prev.filter(
                    (item) =>
                        item.query.toLowerCase() !==
                        newItem.query.toLowerCase()
                );
                // Prepend new item and limit to max
                return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
            });
        }
    }, [movies, searchQuery, setHistory]);

    const handleSelectHistoryQuery = useCallback((query: string) => {
        hapticLight();
        setSearchQuery(query);
    }, []);

    const renderMovieCard = useCallback(
        ({ item, index }: { item: Movie; index: number }) => (
            <MovieCard {...item} index={index} />
        ),
        []
    );

    const movieKeyExtractor = useCallback(
        (item: Movie) => item.id.toString(),
        []
    );

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />
            <FlatList
                data={movies}
                renderItem={renderMovieCard}
                keyExtractor={movieKeyExtractor}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "center",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image
                                source={icons.logo}
                                className="w-12 h-10"
                                resizeMode="contain"
                            />
                        </View>
                        <View className="my-5">
                            <SearchBar
                                placeholder="Search"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Search History — shown when input is empty */}
                        {!searchQuery.trim() && (
                            <SearchHistory
                                onSelectQuery={handleSelectHistoryQuery}
                            />
                        )}

                        {loading && <SearchResultsSkeleton />}

                        {error && (
                            <Text className="text-red-500 text-center px-5 my-3">
                                Error: {error.message}
                            </Text>
                        )}
                        {!loading &&
                            !error &&
                            searchQuery.trim() &&
                            movies &&
                            movies.length > 0 && (
                                <Text className="text-white text-xl font-bold">
                                    Search Results for{" "}
                                    <Text className="text-accent">
                                        {searchQuery}
                                    </Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error && searchQuery.trim() ? (
                        <View className="mt-10 px-5">
                            <Text className="text-gray-500 text-center px-5 my-3">
                                No results found for &quot;{searchQuery}&quot;
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default Search;
