import React, { useCallback, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "expo-router";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
    appPreferencesAtom,
    savedMoviesCountAtom,
    searchHistoryCountAtom,
    searchHistoryAtom,
    authUserAtom,
    isAuthenticatedAtom,
    authLoadingAtom,
} from "@/store";
import { clearAllCache } from "@/utils/storage";
import { hapticMedium, hapticSuccess } from "@/utils/haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
    signInWithGoogle,
    signOutFromGoogle,
    silentSignIn,
    isErrorWithCode,
    statusCodes,
} from "@/services/googleAuth";

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
    onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, index, onPress }) => (
    <Animated.View
        entering={FadeInDown.delay(index * 100).duration(400).springify()}
        className="flex-1"
    >
        <TouchableOpacity 
            className="bg-dark-200 rounded-2xl p-4 flex-1 border border-dark-100"
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Image source={icon} className="size-6 mb-2" tintColor="#AB8BFF" />
            <Text className="text-white text-2xl font-bold">{value}</Text>
            <Text className="text-light-300 text-xs mt-1">{label}</Text>
        </TouchableOpacity>
    </Animated.View>
);

/**
 * Profile screen with native Google Sign-In:
 * - Google Sign-In button when logged out
 * - User profile info when logged in
 * - App statistics, preferences, cache management
 */
const Profile: React.FC = () => {
    const [preferences, setPreferences] = useAtom(appPreferencesAtom);
    const [, setSearchHistory] = useAtom(searchHistoryAtom);
    const [authUser, setAuthUser] = useAtom(authUserAtom);
    const [authLoading, setAuthLoading] = useAtom(authLoadingAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const savedCount = useAtomValue(savedMoviesCountAtom);
    const searchCount = useAtomValue(searchHistoryCountAtom);
    const router = useRouter();

    // Try silent sign-in on mount (restore previous session)
    useEffect(() => {
        const tryRestoreSession = async () => {
            const user = await silentSignIn();
            if (user) {
                setAuthUser(user);
            }
        };
        if (!isAuthenticated) {
            tryRestoreSession();
        }
    }, []);

    const handleSignIn = useCallback(async () => {
        hapticMedium();
        setAuthLoading(true);
        try {
            const user = await signInWithGoogle();

            if (user) {
                setAuthUser(user);
                hapticSuccess();
            }
        } catch (error) {
            console.error("[Auth] Google sign-in error:", error);

            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // Sign-in already in progress, ignore
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        Alert.alert(
                            "Play Services Required",
                            "Please update Google Play Services to sign in."
                        );
                        break;
                    default:
                        Alert.alert(
                            "Sign In Failed",
                            "Could not complete Google sign in. Please try again."
                        );
                }
            } else {
                Alert.alert(
                    "Sign In Error",
                    "An unexpected error occurred. Please try again."
                );
            }
        } finally {
            setAuthLoading(false);
        }
    }, [setAuthUser, setAuthLoading]);

    const handleSignOut = useCallback(() => {
        hapticMedium();
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    await signOutFromGoogle();
                    setAuthUser(null);
                    hapticSuccess();
                },
            },
        ]);
    }, [setAuthUser]);

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
                    {/* Profile Header */}
                    <View className="items-center mt-5 mb-8">
                        {isAuthenticated && authUser ? (
                            <>
                                {/* Authenticated: Show user avatar & info */}
                                <View className="w-20 h-20 rounded-full bg-dark-200 items-center justify-center border-2 border-accent mb-3 overflow-hidden">
                                    {authUser.photo ? (
                                        <Image
                                            source={{ uri: authUser.photo }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Image
                                            source={icons.person}
                                            className="size-10"
                                            tintColor="#AB8BFF"
                                        />
                                    )}
                                </View>
                                <Text className="text-white text-xl font-bold">
                                    {authUser.name}
                                </Text>
                                <Text className="text-light-300 text-sm mt-1">
                                    {authUser.email}
                                </Text>
                                <TouchableOpacity
                                    onPress={handleSignOut}
                                    className="mt-4 bg-dark-200 border border-dark-100 rounded-full px-6 py-2.5 flex-row items-center gap-2"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-red-400 text-sm font-semibold">
                                        Sign Out
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Not authenticated: Show sign-in prompt */}
                                <View className="w-20 h-20 rounded-full bg-dark-200 items-center justify-center border-2 border-dark-100 mb-3">
                                    <Image
                                        source={icons.person}
                                        className="size-10"
                                        tintColor="#A8B5DB"
                                    />
                                </View>
                                <Text className="text-white text-xl font-bold">
                                    Welcome to Showzy
                                </Text>
                                <Text className="text-light-300 text-sm mt-1 text-center px-10">
                                    Sign in to save your favorite movies and
                                    sync your preferences
                                </Text>

                                <TouchableOpacity
                                    onPress={handleSignIn}
                                    disabled={authLoading}
                                    className={`mt-5 rounded-2xl px-8 py-4 flex-row items-center gap-3 ${
                                        authLoading
                                            ? "bg-accent/50"
                                            : "bg-accent"
                                    }`}
                                    activeOpacity={0.7}
                                >
                                    {authLoading ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#fff"
                                        />
                                    ) : (
                                        <Text className="text-white text-lg">
                                            G
                                        </Text>
                                    )}
                                    <Text className="text-white text-base font-semibold">
                                        {authLoading
                                            ? "Signing in..."
                                            : "Sign in with Google"}
                                    </Text>
                                </TouchableOpacity>

                                <Text className="text-light-300 text-xs mt-3 text-center px-8">
                                    By signing in, you can save movies to your
                                    favorites and access them anytime
                                </Text>
                            </>
                        )}
                    </View>

                    {/* Stats */}
                    <View className="flex-row gap-4 mb-8">
                        <StatCard
                            label="Saved Movies"
                            value={savedCount}
                            icon={icons.save}
                            index={0}
                            onPress={() => router.push("/(tabs)/saved")}
                        />
                        <StatCard
                            label="Searches"
                            value={searchCount}
                            icon={icons.search}
                            index={1}
                            onPress={() => router.push("/(tabs)/search")}
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

                    {/* App Info & Legal */}
                    <Animated.View
                        entering={FadeInDown.delay(500).duration(400)}
                        className="items-center mt-5 mb-10"
                    >
                        <Text className="text-light-300 text-xs">
                            Showzy v1.0.0
                        </Text>
                        <Text className="text-light-300 text-xs mt-1 mb-4">
                            Built with React Native + Expo
                        </Text>
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity onPress={() => router.push("/privacy")}>
                                <Text className="text-accent text-xs font-semibold underline">
                                    Privacy Policy
                                </Text>
                            </TouchableOpacity>
                            <Text className="text-light-300 text-xs">•</Text>
                            <TouchableOpacity onPress={() => router.push("/terms")}>
                                <Text className="text-accent text-xs font-semibold underline">
                                    Terms of Service
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default Profile;
