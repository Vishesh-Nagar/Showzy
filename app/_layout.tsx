import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { Provider as JotaiProvider } from "jotai";
import { useEffect } from "react";
import { clearExpiredCache } from "@/utils/storage";

/**
 * Root layout with Jotai Provider wrapping the entire app.
 * Clears expired cache on app startup for storage hygiene.
 */
export default function RootLayout() {
    useEffect(() => {
        // Clean up expired cache entries on app start
        clearExpiredCache();
    }, []);

    return (
        <JotaiProvider>
            <StatusBar hidden={true} />
            <Stack
                screenOptions={{
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: "#1f2937",
                    },
                    headerTintColor: "#f3f4f6",
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="movies/[id]"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </JotaiProvider>
    );
}
