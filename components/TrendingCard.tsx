import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { images } from "@/constants/images";
import Animated, { FadeInRight } from "react-native-reanimated";

/**
 * Trending movie card with:
 * - Full TypeScript typing (converted from .jsx)
 * - Reanimated FadeInRight entering animation
 * - React.memo for performance
 * - Masked ranking number overlay
 */
const TrendingCard: React.FC<TrendingCardProps> = ({
    movie: { movie_id, title, poster_url },
    index,
}) => {
    return (
        <Link href={`/movies/${movie_id}`} asChild>
            <TouchableOpacity className="w-32 relative pl-5" activeOpacity={0.7}>
                <Animated.View
                    entering={FadeInRight.delay(index * 150)
                        .duration(500)
                        .springify()}
                >
                    <Image
                        source={{ uri: poster_url }}
                        className="w-32 h-48 rounded-lg"
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
                        <MaskedView
                            maskElement={
                                <Text className="font-bold text-white text-6xl">
                                    {index + 1}
                                </Text>
                            }
                        >
                            <Image
                                source={images.rankingGradient}
                                className="size-14"
                                resizeMode="cover"
                            />
                        </MaskedView>
                    </View>
                    <Text
                        className="text-light-200 text-sm font-bold mt-2"
                        numberOfLines={2}
                    >
                        {title}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
};

export default memo(TrendingCard);
