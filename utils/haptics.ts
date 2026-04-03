import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Platform-safe haptic feedback utilities.
 * Wraps expo-haptics with no-op fallback for web/unsupported platforms.
 * Demonstrates native module integration.
 */

const isNative = Platform.OS === "ios" || Platform.OS === "android";

/** Light tap — tab switches, list item tap */
export const hapticLight = (): void => {
    if (isNative) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
};

/** Medium tap — save/unsave, toggle actions */
export const hapticMedium = (): void => {
    if (isNative) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
};

/** Heavy tap — destructive actions, confirmations */
export const hapticHeavy = (): void => {
    if (isNative) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
};

/** Success notification — completed actions */
export const hapticSuccess = (): void => {
    if (isNative) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
};

/** Warning notification — potentially destructive action */
export const hapticWarning = (): void => {
    if (isNative) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
};

/** Selection changed — picker or selection UI */
export const hapticSelection = (): void => {
    if (isNative) {
        Haptics.selectionAsync();
    }
};
