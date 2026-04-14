import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { images } from "@/constants/images";

export default function TermsOfService() {
    return (
        <View className="flex-1 bg-primary">
            <Stack.Screen
                options={{
                    title: "Terms of Service",
                    headerStyle: { backgroundColor: "#030014" },
                    headerTintColor: "#fff",
                }}
            />
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />
            <SafeAreaView className="flex-1" edges={["bottom", "left", "right"]}>
                <ScrollView
                    className="flex-1 px-5 pt-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <Text className="text-white text-2xl font-bold mb-6">
                        Terms of Service
                    </Text>

                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        1. Agreement to Terms
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        By accessing our application, Showzy, you agree to be bound by these Terms of Service. If you disagree with any part of the terms then you may not access the service.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        2. Use License
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Showzy's application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        3. TMDB API Usage
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        This product uses the TMDB API but is not endorsed or certified by TMDB. All movie data, images, and content are provided by The Movie Database (TMDB). You must adhere to TMDB's terms of use regarding the data displayed in this application.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        4. Disclaimer
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        The materials on Showzy's application are provided on an 'as is' basis. Showzy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        5. Limitations
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        In no event shall Showzy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Showzy's application.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        6. Accounts
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
