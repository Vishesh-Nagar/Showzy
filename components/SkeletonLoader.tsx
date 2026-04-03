import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Easing,
} from "react-native-reanimated";

interface SkeletonProps {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: object;
}

/**
 * Animated shimmer skeleton loader.
 * Replaces plain ActivityIndicator with a polished loading experience.
 * Demonstrates react-native-reanimated usage for performance-optimized animations.
 */
const SkeletonItem: React.FC<SkeletonProps> = ({
    width,
    height,
    borderRadius = 8,
    style,
}) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(opacity.value, [0.3, 1], [0.3, 0.7]),
    }));

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height,
                    borderRadius,
                    backgroundColor: "#221F3D",
                },
                animatedStyle,
                style,
            ]}
        />
    );
};

/** Skeleton for a single movie card in the grid */
const MovieCardSkeleton: React.FC = () => (
    <View style={{ width: "30%", marginBottom: 10 }}>
        <SkeletonItem width="100%" height={208} borderRadius={8} />
        <SkeletonItem
            width="80%"
            height={14}
            borderRadius={4}
            style={{ marginTop: 8 }}
        />
        <SkeletonItem
            width="50%"
            height={12}
            borderRadius={4}
            style={{ marginTop: 6 }}
        />
    </View>
);

/** Skeleton for a trending card in the horizontal list */
const TrendingCardSkeleton: React.FC = () => (
    <View style={{ width: 128, marginRight: 16, paddingLeft: 20 }}>
        <SkeletonItem width={128} height={192} borderRadius={8} />
        <SkeletonItem
            width={100}
            height={12}
            borderRadius={4}
            style={{ marginTop: 8 }}
        />
    </View>
);

/** Full home screen skeleton layout */
export const HomeScreenSkeleton: React.FC = () => (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Search bar skeleton */}
        <SkeletonItem width="100%" height={52} borderRadius={26} />

        {/* Trending section */}
        <SkeletonItem
            width={160}
            height={20}
            borderRadius={4}
            style={{ marginTop: 40, marginBottom: 12 }}
        />
        <View style={{ flexDirection: "row" }}>
            {[0, 1, 2].map((i) => (
                <TrendingCardSkeleton key={i} />
            ))}
        </View>

        {/* Latest movies section */}
        <SkeletonItem
            width={140}
            height={20}
            borderRadius={4}
            style={{ marginTop: 20, marginBottom: 12 }}
        />
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 20,
            }}
        >
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </View>
    </View>
);

/** Skeleton for the search results screen */
export const SearchResultsSkeleton: React.FC = () => (
    <View
        style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            paddingHorizontal: 20,
            justifyContent: "center",
        }}
    >
        {[0, 1, 2, 3, 4, 5].map((i) => (
            <MovieCardSkeleton key={i} />
        ))}
    </View>
);

export default SkeletonItem;
