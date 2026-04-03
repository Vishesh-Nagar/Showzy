import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import React, { useCallback, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import Animated, {
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from "react-native-reanimated";

import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { savedMoviesAtom, SavedMovie } from "@/store";
import { hapticMedium, hapticSuccess } from "@/utils/haptics";
import { HomeScreenSkeleton } from "@/components/SkeletonLoader";

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-xl">{label}</Text>
        <Text className="text-white font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

/**
 * Movie details screen with:
 * - Save/Unsave toggle with Jotai state (persisted offline)
 * - Haptic feedback on interactions
 * - Reanimated entering animations
 * - Offline-cached movie data
 */
const Details: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [savedMovies, setSavedMovies] = useAtom(savedMoviesAtom);

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    /** Check if movie is saved (derived state) */
    const isSaved = useMemo(
        () => savedMovies.some((m) => m.id === Number(id)),
        [savedMovies, id]
    );

    /** Toggle save/unsave with haptic feedback */
    const toggleSave = useCallback(() => {
        if (!movie) return;

        if (isSaved) {
            hapticMedium();
            setSavedMovies((prev) => prev.filter((m) => m.id !== movie.id));
        } else {
            hapticSuccess();
            const savedMovie: SavedMovie = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path ?? "",
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                savedAt: Date.now(),
            };
            setSavedMovies((prev) => [savedMovie, ...prev]);
        }
    }, [movie, isSaved, setSavedMovies]);

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <HomeScreenSkeleton />
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        className="w-full h-[550px]"
                        resizeMode="stretch"
                    />

                    {/* Save Button */}
                    <Animated.View
                        entering={ZoomIn.delay(300).duration(400).springify()}
                        className="absolute top-12 right-5"
                    >
                        <TouchableOpacity
                            onPress={toggleSave}
                            className={`rounded-full size-12 flex items-center justify-center ${
                                isSaved ? "bg-accent" : "bg-black/50"
                            }`}
                            activeOpacity={0.7}
                        >
                            <Text className="text-2xl">
                                {isSaved ? "♥" : "♡"}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Play Button */}
                    <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
                        <Image
                            source={icons.play}
                            className="w-6 h-7 ml-1"
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                </View>

                <Animated.View
                    entering={FadeInUp.delay(200).duration(500)}
                    className="flex-col items-start justify-center mt-5 px-5"
                >
                    <Text className="text-white font-bold text-3xl">
                        {movie?.title}
                    </Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-white text-sm">
                            {movie?.release_date?.split("-")[0]} •
                        </Text>
                        <Text className="text-white text-sm">
                            {movie?.runtime} mins
                        </Text>
                    </View>

                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-white font-bold text-sm">
                            {(movie?.vote_average ?? 0).toFixed(1)}
                        </Text>
                        <Text className="text-white text-sm">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>

                    <MovieInfo label="Overview" value={movie?.overview} />
                    <MovieInfo
                        label="Genres"
                        value={
                            movie?.genres?.map((g) => g.name).join(" • ") ||
                            "N/A"
                        }
                    />

                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo
                            label="Budget"
                            value={`$${
                                (movie?.budget ?? 0) / 1_000_000
                            } million`}
                        />
                        <MovieInfo
                            label="Revenue"
                            value={`$${Math.round(
                                (movie?.revenue ?? 0) / 1_000_000
                            )} million`}
                        />
                    </View>

                    <MovieInfo
                        label="Production Companies"
                        value={
                            movie?.production_companies
                                ?.map((c) => c.name)
                                .join(" • ") || "N/A"
                        }
                    />
                </Animated.View>
            </ScrollView>

            {/* Bottom Bar */}
            <Animated.View
                entering={FadeInDown.delay(400).duration(400)}
                className="absolute bottom-5 left-0 right-0 mx-5 flex-row gap-3 z-50"
            >
                <TouchableOpacity
                    className="flex-1 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center"
                    onPress={router.back}
                >
                    <Image
                        source={icons.arrow}
                        className="size-5 mr-1 mt-0.5 rotate-180"
                        tintColor="#fff"
                    />
                    <Text className="text-white font-semibold text-base">
                        Go Back
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={toggleSave}
                    className={`rounded-lg py-3.5 px-5 flex items-center justify-center ${
                        isSaved
                            ? "bg-accent/20 border border-accent"
                            : "bg-dark-200 border border-dark-100"
                    }`}
                    activeOpacity={0.7}
                >
                    <Text className="text-xl">{isSaved ? "♥" : "♡"}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default Details;
