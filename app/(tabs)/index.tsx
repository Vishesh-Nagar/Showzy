import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
    FlatList,
    Image,
    ScrollView,
    Text,
    View,
} from "react-native";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { HomeScreenSkeleton } from "@/components/SkeletonLoader";
import React, { useCallback } from "react";

export default function Index() {
    const router = useRouter();
    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
    } = useFetch(() => fetchMovies({ query: "" }));

    /** Memoized render functions to avoid re-creating on each render */
    const renderMovieCard = useCallback(
        ({ item, index }: { item: Movie; index: number }) => (
            <MovieCard {...item} index={index} />
        ),
        []
    );

    const renderTrendingCard = useCallback(
        ({ item, index }: { item: TrendingMovie; index: number }) => (
            <TrendingCard movie={item} index={index} />
        ),
        []
    );

    const movieKeyExtractor = useCallback(
        (item: Movie) => item.id.toString(),
        []
    );

    const trendingKeyExtractor = useCallback(
        (item: TrendingMovie) => item.movie_id.toString(),
        []
    );

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" />
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
            >
                <Image
                    source={icons.logo}
                    className="w-12 h-10 mt-20 mb-5 mx-auto"
                />
                {moviesLoading || trendingLoading ? (
                    <HomeScreenSkeleton />
                ) : moviesError || trendingError ? (
                    <Text className="text-white text-center mt-10">
                        {moviesError?.message || trendingError?.message}
                    </Text>
                ) : (
                    <View className="flex-1 mt-5">
                        <SearchBar
                            onPress={() => router.push("/search")}
                            placeholder="Search for a movie"
                        />
                        {trendingMovies && (
                            <View className="mt-10">
                                <Text className="text-white text-lg font-bold mb-3">
                                    Trending Movies
                                </Text>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ItemSeparatorComponent={() => (
                                        <View className="w-4" />
                                    )}
                                    data={trendingMovies}
                                    renderItem={renderTrendingCard}
                                    className="mb-4 mt-3"
                                    keyExtractor={trendingKeyExtractor}
                                />
                            </View>
                        )}
                        <>
                            <Text className="text-white text-lg font-bold mt-5 mb-3">
                                Latest Movies
                            </Text>
                            <FlatList
                                data={movies}
                                renderItem={renderMovieCard}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={movieKeyExtractor}
                                numColumns={3}
                                columnWrapperStyle={{
                                    justifyContent: "flex-start",
                                    gap: 20,
                                    paddingRight: 5,
                                    marginBottom: 10,
                                }}
                                className="mt-2 pb-32"
                                scrollEnabled={false}
                            />
                        </>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
