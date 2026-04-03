import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import Animated, { FadeInDown } from "react-native-reanimated";

interface MovieCardProps extends Movie {
    index?: number;
}

/**
 * Movie card component with:
 * - React.memo for re-render prevention (performance optimization)
 * - Reanimated FadeInDown entering animation with stagger
 * - Responsive layout
 */
const MovieCard: React.FC<MovieCardProps> = ({
    id,
    poster_path,
    title,
    vote_average,
    release_date,
    index = 0,
}) => {
    return (
        <Link href={`/movies/${id}`} asChild className="w-[30%]">
            <TouchableOpacity activeOpacity={0.7} className="w-[30%]">
                <Animated.View
                    entering={FadeInDown.delay(index * 100)
                        .duration(400)
                        .springify()}
                >
                    <Image
                        source={{
                            uri: poster_path
                                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                                : "https://placehold.co/600x400/1a1a1a/ffffff.png",
                        }}
                        className="w-full h-52 rounded-lg"
                        resizeMode="cover"
                    />
                    <Text
                        className="text-white text-sm font-bold mt-2"
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <View className="flex-row items-center justify-start gap-x-1">
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-white text-xs">
                            {(vote_average ?? 0).toFixed(1)}
                        </Text>
                        <Text className="text-xs text-light-300 font-medium ml-5">
                            {release_date
                                ? new Date(release_date).getFullYear()
                                : "N/A"}
                        </Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
};

export default memo(MovieCard);
