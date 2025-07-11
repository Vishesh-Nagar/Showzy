import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants/images";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { updateSearchCount } from "@/services/appwrite";
const search = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(
        () =>
            fetchMovies({
                query: searchQuery,
            }),
        false
    );

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        if (movies?.length > 0 && movies?.[0]) {
            updateSearchCount(searchQuery, movies[0]);
        }
    }, [movies]);

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            ></Image>
            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "center",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-20 items-center">
                            <Image
                                source={icons.logo}
                                className="w-12 h-10"
                                resizeMode="contain"
                            />
                        </View>
                        <View className="my-5">
                            <SearchBar
                                placeholder="Search"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        {loading && (
                            <ActivityIndicator
                                size="large"
                                color="#fff"
                                className="my-3"
                            />
                        )}
                        {error && (
                            <Text className="text-red-500 text-center px-5 my-3">
                                Error: {error.message}
                            </Text>
                        )}
                        {!loading &&
                            !error &&
                            searchQuery.trim() &&
                            movies?.length > 0 && (
                                <Text className="text-white text-xl font-bold">
                                    Search Results for{" "}
                                    <Text className="text-accent">
                                        {searchQuery}
                                    </Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error && searchQuery.trim() ? (
                        <View className="mt-10 px-5">
                            <Text className="text-gray-500 text-center px-5 my-3">
                                {searchQuery.trim()
                                    ? `No results found`
                                    : "Please enter a search term."}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default search;
