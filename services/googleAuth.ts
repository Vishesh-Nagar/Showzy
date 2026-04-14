import {
    GoogleSignin,
    isSuccessResponse,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import { AuthUser } from "@/store/authAtoms";

/**
 * Google OAuth service using native Google Sign-In.
 * Uses @react-native-google-signin/google-signin for a native, reliable auth flow.
 *
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create OAuth 2.0 Client IDs for Android, iOS, and Web
 * 3. Add Web client ID to .env as EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
 * 4. For Android: add SHA-1 fingerprint to Android client in Google Console
 */

/**
 * Configure GoogleSignin — call once at app startup (e.g. in _layout.tsx).
 * webClientId is required to get the idToken on the user object.
 */
export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
    });
};

/**
 * Perform the native Google Sign-In flow.
 * Returns a normalized AuthUser object on success, or null if cancelled.
 * Throws on error.
 */
export const signInWithGoogle = async (): Promise<AuthUser | null> => {
    // Ensure Play Services are available (Android-only, always true on iOS)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
        const { data } = response;
        const user = data.user;

        return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email,
            photo: user.photo ?? null,
            givenName: user.givenName ?? null,
            familyName: user.familyName ?? null,
        };
    }

    // User cancelled the sign-in
    return null;
};

/**
 * Sign out the current user from Google.
 */
export const signOutFromGoogle = async (): Promise<void> => {
    try {
        await GoogleSignin.signOut();
    } catch (error) {
        console.warn("[Auth] Google sign-out error:", error);
    }
};

/**
 * Try to silently sign in a previously authenticated user.
 * Returns AuthUser if a session exists, null otherwise.
 */
export const silentSignIn = async (): Promise<AuthUser | null> => {
    try {
        const response = await GoogleSignin.signInSilently();

        if (isSuccessResponse(response)) {
            const { data } = response;
            const user = data.user;

            return {
                id: user.id,
                email: user.email,
                name: user.name ?? user.email,
                photo: user.photo ?? null,
                givenName: user.givenName ?? null,
                familyName: user.familyName ?? null,
            };
        }

        return null;
    } catch {
        return null;
    }
};

// Re-export utilities for error handling in components
export { isErrorWithCode, statusCodes };
