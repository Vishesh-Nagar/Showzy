import 'react-native-url-polyfill/auto';
import { getDefaultStore } from "jotai";
import { Client, Databases, ID, Query } from "react-native-appwrite";
import { apiCallCountAtom } from "@/store/atoms";

const store = getDefaultStore();

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "";
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID ?? "";

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform("com.showzy");

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    // Track API call
    store.set(apiCallCountAtom, (prev) => prev + 1);

    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal("movie_id", movie.id)]
        );

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            const newCount =
                (typeof existingMovie.count === "number"
                    ? existingMovie.count
                    : 0) + 1;

            const updatedDoc = await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: newCount,
                }
            );

            return updatedDoc;
        } else {
            const newDoc = await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: query,
                    count: 1,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    movie_id: movie.id,
                    title: movie.title,
                }
            );
            return newDoc;
        }
    } catch (error) {
        console.error("Error in updateSearchCount:", error);
        throw error;
    }
};

export const getTrendingMovies = async (): Promise<
    TrendingMovie[] | undefined
> => {
    // Track API call
    store.set(apiCallCountAtom, (prev) => prev + 1);

    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(5), Query.orderDesc("count")]
        );
        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};
