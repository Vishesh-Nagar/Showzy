import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useAtom } from "jotai";
import { searchHistoryAtom, SearchHistoryItem } from "@/store";
import { hapticLight } from "@/utils/haptics";

interface SearchHistoryProps {
    onSelectQuery: (query: string) => void;
}

/**
 * Displays recent search queries as tappable chips.
 * Persisted via Jotai + AsyncStorage for offline-first access.
 */
const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectQuery }) => {
    const [history, setHistory] = useAtom(searchHistoryAtom);

    const handleClearAll = () => {
        Alert.alert(
            "Clear Search History",
            "Are you sure you want to clear all search history?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => setHistory([]),
                },
            ]
        );
    };

    const handleRemoveItem = (timestamp: number) => {
        hapticLight();
        setHistory(history.filter((item) => item.timestamp !== timestamp));
    };

    const handleSelectQuery = (query: string) => {
        hapticLight();
        onSelectQuery(query);
    };

    if (!history || history.length === 0) return null;

    return (
        <View className="mt-3 mb-5">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-base font-semibold">
                    Recent Searches
                </Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text className="text-accent text-sm">Clear All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            >
                {history.map((item: SearchHistoryItem) => (
                    <TouchableOpacity
                        key={item.timestamp}
                        onPress={() => handleSelectQuery(item.query)}
                        onLongPress={() => handleRemoveItem(item.timestamp)}
                        className="bg-dark-200 px-4 py-2 rounded-full border border-dark-100"
                        activeOpacity={0.7}
                    >
                        <Text className="text-light-200 text-sm">
                            {item.query}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text className="text-light-300 text-xs mt-2">
                Long press to remove
            </Text>
        </View>
    );
};

export default SearchHistory;
