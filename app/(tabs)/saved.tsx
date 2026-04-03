import React, { useCallback } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { Link } from "expo-router";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { savedMoviesAtom, SavedMovie } from "@/store";
import { hapticMedium, hapticWarning } from "@/utils/haptics";

/**
 * Saved Movies screen — fully functional bookmarks with:
 * - Jotai state management (savedMoviesAtom)
 * - Offline persistence via AsyncStorage
 * - Animated list items
 * - Long-press to remove
 */
const SavedMovieCard: React.FC<{
    movie: SavedMovie;
    index: number;
    onRemove: (id: number) => void;
}> = ({ movie, index, onRemove }) => (
    <Link href={`/movies/${movie.id}`} asChild className="w-[30%]">
        <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => onRemove(movie.id)}
            className="w-[30%]"
        >
            <Animated.View
                entering={FadeInDown.delay(index * 80).duration(400).springify()}
                exiting={FadeOut.duration(300)}
            >
                <Image
                    source={{
                        uri: movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://placehold.co/600x400/1a1a1a/ffffff.png",
                    }}
                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"
                />
                <Text
                    className="text-white text-sm font-bold mt-2"
                    numberOfLines={1}
                >
                    {movie.title}
                </Text>
                <Text className="text-light-300 text-xs">
                    Saved{" "}
                    {new Date(movie.savedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    </Link>
);

const Saved: React.FC = () => {
    const [savedMovies, setSavedMovies] = useAtom(savedMoviesAtom);

    const handleRemoveMovie = useCallback(
        (movieId: number) => {
            hapticWarning();
            const movie = savedMovies.find((m) => m.id === movieId);
            Alert.alert(
                "Remove Movie",
                `Remove "${movie?.title}" from saved?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Remove",
                        style: "destructive",
                        onPress: () => {
                            hapticMedium();
                            setSavedMovies((prev) =>
                                prev.filter((m) => m.id !== movieId)
                            );
                        },
                    },
                ]
            );
        },
        [savedMovies, setSavedMovies]
    );

    const handleClearAll = useCallback(() => {
        hapticWarning();
        Alert.alert(
            "Clear All Saved",
            "Remove all saved movies? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: () => {
                        hapticMedium();
                        setSavedMovies([]);
                    },
                },
            ]
        );
    }, [setSavedMovies]);

    const renderItem = useCallback(
        ({ item, index }: { item: SavedMovie; index: number }) => (
            <SavedMovieCard
                movie={item}
                index={index}
                onRemove={handleRemoveMovie}
            />
        ),
        [handleRemoveMovie]
    );

    const keyExtractor = useCallback(
        (item: SavedMovie) => item.id.toString(),
        []
    );

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />
            <SafeAreaView className="flex-1">
                <FlatList
                    data={savedMovies}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    className="px-5"
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "flex-start",
                        gap: 20,
                        paddingRight: 5,
                        marginBottom: 10,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 100,
                    }}
                    ListHeaderComponent={
                        <View className="my-5">
                            <View className="flex-row justify-between items-center mb-5">
                                <Text className="text-white text-2xl font-bold">
                                    Saved Movies
                                </Text>
                                {savedMovies.length > 0 && (
                                    <TouchableOpacity onPress={handleClearAll}>
                                        <Text className="text-accent text-sm">
                                            Clear All
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {savedMovies.length > 0 && (
                                <Text className="text-light-300 text-xs mb-3">
                                    {savedMovies.length} movie
                                    {savedMovies.length !== 1 ? "s" : ""} saved
                                    • Long press to remove
                                </Text>
                            )}
                        </View>
                    }
                    ListEmptyComponent={
                        <View className="flex justify-center items-center flex-1 flex-col gap-5 mt-20">
                            <Image
                                source={icons.save}
                                className="size-10"
                                tintColor="#A8B5DB"
                            />
                            <Text className="text-light-300 text-base text-center">
                                No saved movies yet
                            </Text>
                            <Text className="text-light-300 text-sm text-center px-10">
                                Tap the ♥ button on any movie to save it for
                                offline access
                            </Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </View>
    );
};

export default Saved;
