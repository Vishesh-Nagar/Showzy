import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { images } from "@/constants/images";

export default function PrivacyPolicy() {
    return (
        <View className="flex-1 bg-primary">
            <Stack.Screen
                options={{
                    title: "Privacy Policy",
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
                        Privacy Policy
                    </Text>

                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        Last updated: {new Date().toLocaleDateString()}
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        1. Introduction
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        Welcome to Showzy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please reach out to us.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        2. Information We Collect
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        When you use our application to browse or save movies, we may collect personal information that you provide to us such as your Google Account information when you sign in, as well as usage data such as search history and saved movies.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        3. How We Use Your Information
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests:
                        {"\n\n"}• To facilitate account creation and logon process.
                        {"\n"}• To manage user accounts.
                        {"\n"}• To save your favorite movies and search history across devices.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        4. Data Sharing
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. Your authentication data is managed securely via Google Sign-In and Appwrite cloud infrastructure.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        5. Data Storage & Security
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                    </Text>

                    <Text className="text-white text-lg font-bold mb-2 mt-4">
                        6. Your Rights
                    </Text>
                    <Text className="text-light-200 text-sm mb-4 leading-6">
                        You have the right to request access to and deletion of the personal data we hold on you. You can easily clear your search history, manage preferences, or sign out directly from the Profile tab within the Showzy app.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
