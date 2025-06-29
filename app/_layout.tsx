import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
    return (
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
    );
}
