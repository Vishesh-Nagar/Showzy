import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
    FlatList,
    Image,
    ScrollView,
    Text,
    View,
    RefreshControl,
} from "react-native";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { HomeScreenSkeleton } from "@/components/SkeletonLoader";
import React, { useCallback, useState, useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

const AnimatedLogo = () => {
    const isFocused = useIsFocused();
    const textTranslateY = useSharedValue(-20);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        if (isFocused) {
            textTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
            textOpacity.value = withTiming(1, { duration: 300 });
        } else {
            textTranslateY.value = withTiming(-20, { duration: 200 });
            textOpacity.value = withTiming(0, { duration: 200 });
        }
    }, [isFocused]);

    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: textTranslateY.value }],
        opacity: textOpacity.value,
    }));

    return (
        <View className="items-center mt-20 mb-5 relative z-10">
            <View className="z-10  px-2">
                <Image
                    source={icons.logo}
                    className="w-12 h-10"
                    resizeMode="contain"
                />
            </View>
            <Animated.Text 
                className="text-white text-3xl font-black uppercase tracking-widest absolute top-14" 
                style={animatedTextStyle}
            >
                Showzy
            </Animated.Text>
        </View>
    );
};

export default function Index() {
    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
        refetch: refetchTrending,
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
        refetch: refetchMovies,
    } = useFetch(() => fetchMovies({ query: "" }));

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetchTrending(), refetchMovies()]);
        setRefreshing(false);
    }, [refetchTrending, refetchMovies]);

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
        (item: Movie, index: number) => `${item.id}-${index}`,
        []
    );

    const trendingKeyExtractor = useCallback(
        (item: TrendingMovie, index: number) => `${item.movie_id}-${index}`,
        []
    );

    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full z-0" />
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                        titleColor="#fff"
                    />
                }
            >
                <AnimatedLogo />
                {moviesLoading || trendingLoading ? (
                    <HomeScreenSkeleton />
                ) : moviesError || trendingError ? (
                    <Text className="text-white text-center mt-10">
                        {moviesError?.message || trendingError?.message}
                    </Text>
                ) : (
                    <View className="flex-1 mt-5">
                        {trendingMovies && trendingMovies.length > 0 && (
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
                                    className="mb-4 mt-3 -mx-5"
                                    contentContainerStyle={{ paddingHorizontal: 20 }}
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
