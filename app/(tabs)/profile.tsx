import React, { useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAtom, useAtomValue } from "jotai";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
    appPreferencesAtom,
    savedMoviesCountAtom,
    searchHistoryCountAtom,
    searchHistoryAtom,
} from "@/store";
import { clearAllCache } from "@/utils/storage";
import { hapticMedium, hapticSuccess } from "@/utils/haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

/** Genre mapping from TMDB API */
const GENRES: { id: number; name: string }[] = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
];

interface StatCardProps {
    label: string;
    value: number;
    icon: any;
    index: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, index }) => (
    <Animated.View
        entering={FadeInDown.delay(index * 100).duration(400).springify()}
        className="bg-dark-200 rounded-2xl p-4 flex-1 border border-dark-100"
    >
        <Image source={icon} className="size-6 mb-2" tintColor="#AB8BFF" />
        <Text className="text-white text-2xl font-bold">{value}</Text>
        <Text className="text-light-300 text-xs mt-1">{label}</Text>
    </Animated.View>
);

/**
 * Profile screen with:
 * - App statistics (saved count, search count)
 * - Preference toggles using Jotai atoms
 * - Genre selection chips
 * - Cache management
 * - Demonstrates state management + offline-first patterns
 */
const Profile: React.FC = () => {
    const [preferences, setPreferences] = useAtom(appPreferencesAtom);
    const [, setSearchHistory] = useAtom(searchHistoryAtom);
    const savedCount = useAtomValue(savedMoviesCountAtom);
    const searchCount = useAtomValue(searchHistoryCountAtom);

    const toggleAdultFilter = useCallback(() => {
        hapticMedium();
        setPreferences((prev) => ({
            ...prev,
            adultContentFilter: !prev.adultContentFilter,
        }));
    }, [setPreferences]);

    const toggleGenre = useCallback(
        (genreId: number) => {
            hapticMedium();
            setPreferences((prev) => {
                const genres = prev.preferredGenres.includes(genreId)
                    ? prev.preferredGenres.filter((id) => id !== genreId)
                    : [...prev.preferredGenres, genreId];
                return { ...prev, preferredGenres: genres };
            });
        },
        [setPreferences]
    );

    const handleClearCache = useCallback(() => {
        Alert.alert(
            "Clear Cache",
            "This will remove all cached movie data. Fresh data will be fetched on next use.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        await clearAllCache();
                        hapticSuccess();
                        Alert.alert("Done", "Cache cleared successfully.");
                    },
                },
            ]
        );
    }, []);

    const handleClearSearchHistory = useCallback(() => {
        Alert.alert(
            "Clear Search History",
            "Remove all search history? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                        setSearchHistory([]);
                        hapticSuccess();
                    },
                },
            ]
        );
    }, [setSearchHistory]);

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />
            <SafeAreaView className="flex-1">
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Header */}
                    <View className="items-center mt-5 mb-8">
                        <View className="w-20 h-20 rounded-full bg-dark-200 items-center justify-center border-2 border-accent mb-3">
                            <Image
                                source={icons.person}
                                className="size-10"
                                tintColor="#AB8BFF"
                            />
                        </View>
                        <Text className="text-white text-xl font-bold">
                            Movie Enthusiast
                        </Text>
                        <Text className="text-light-300 text-sm mt-1">
                            Showzy User
                        </Text>
                    </View>

                    {/* Stats */}
                    <View className="flex-row gap-4 mb-8">
                        <StatCard
                            label="Saved Movies"
                            value={savedCount}
                            icon={icons.save}
                            index={0}
                        />
                        <StatCard
                            label="Searches"
                            value={searchCount}
                            icon={icons.search}
                            index={1}
                        />
                    </View>

                    {/* Preferences Section */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(400)}
                        className="bg-dark-200 rounded-2xl p-5 mb-5 border border-dark-100"
                    >
                        <Text className="text-white text-lg font-bold mb-4">
                            Preferences
                        </Text>

                        {/* Adult Content Filter */}
                        <View className="flex-row justify-between items-center mb-2">
                            <View className="flex-1">
                                <Text className="text-white text-sm font-medium">
                                    Adult Content Filter
                                </Text>
                                <Text className="text-light-300 text-xs mt-1">
                                    Hide adult-rated movies from results
                                </Text>
                            </View>
                            <Switch
                                value={preferences.adultContentFilter}
                                onValueChange={toggleAdultFilter}
                                trackColor={{
                                    false: "#221F3D",
                                    true: "#AB8BFF",
                                }}
                                thumbColor="#fff"
                            />
                        </View>
                    </Animated.View>

                    {/* Genre Preferences */}
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(400)}
                        className="bg-dark-200 rounded-2xl p-5 mb-5 border border-dark-100"
                    >
                        <Text className="text-white text-lg font-bold mb-2">
                            Favorite Genres
                        </Text>
                        <Text className="text-light-300 text-xs mb-4">
                            Select your preferred genres
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {GENRES.map((genre) => {
                                const isSelected =
                                    preferences.preferredGenres.includes(
                                        genre.id
                                    );
                                return (
                                    <TouchableOpacity
                                        key={genre.id}
                                        onPress={() => toggleGenre(genre.id)}
                                        className={`px-4 py-2 rounded-full border ${
                                            isSelected
                                                ? "bg-accent border-accent"
                                                : "bg-dark-100 border-dark-100"
                                        }`}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            className={`text-sm ${
                                                isSelected
                                                    ? "text-white font-semibold"
                                                    : "text-light-200"
                                            }`}
                                        >
                                            {genre.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Animated.View>

                    {/* Data Management */}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(400)}
                        className="bg-dark-200 rounded-2xl p-5 mb-5 border border-dark-100"
                    >
                        <Text className="text-white text-lg font-bold mb-4">
                            Data Management
                        </Text>

                        <TouchableOpacity
                            onPress={handleClearSearchHistory}
                            className="flex-row justify-between items-center py-3 border-b border-dark-100"
                            activeOpacity={0.7}
                        >
                            <Text className="text-white text-sm">
                                Clear Search History
                            </Text>
                            <Text className="text-light-300 text-xs">
                                {searchCount} items
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleClearCache}
                            className="flex-row justify-between items-center py-3"
                            activeOpacity={0.7}
                        >
                            <Text className="text-white text-sm">
                                Clear Cached Data
                            </Text>
                            <Text className="text-light-300 text-xs">
                                Offline data
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* App Info */}
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(400)}
                        className="items-center mt-5"
                    >
                        <Text className="text-light-300 text-xs">
                            Showzy v1.0.0
                        </Text>
                        <Text className="text-light-300 text-xs mt-1">
                            Built with React Native + Expo
                        </Text>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default Profile;
