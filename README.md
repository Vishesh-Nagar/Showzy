# 🎬 Showzy — Movie Discovery App

A feature-rich mobile movie discovery app built with **React Native (Expo)** and **TypeScript**. Browse trending movies, search the TMDB catalog, save favorites offline, and manage preferences — all powered by a modern mobile stack.

## ✨ Features

- **🏠 Home Feed** — Browse popular movies with trending section powered by Appwrite analytics
- **🔍 Smart Search** — Debounced search with persistent search history (offline-first)
- **💾 Offline Bookmarks** — Save movies locally with Jotai + AsyncStorage persistence
- **👤 Profile & Preferences** — Genre preferences, content filters, cache management
- **⚡ Performance Optimized** — React.memo, useCallback, skeleton loaders, cached API responses
- **🫣 Haptic Feedback** — Native tactile feedback on key interactions (save, tab switch)
- **🎞️ Smooth Animations** — Reanimated-powered enter/exit animations throughout

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **React Native** (Expo SDK 53) | Cross-platform mobile framework |
| **TypeScript** | Type-safe development |
| **Expo Router** | File-based navigation |
| **Jotai** | Atomic state management with persistence |
| **AsyncStorage** | Offline-first local storage |
| **React Native Reanimated** | High-performance animations |
| **Expo Haptics** | Native haptic feedback |
| **NativeWind** (TailwindCSS) | Utility-first styling |
| **Appwrite** | Backend — trending movie analytics |
| **TMDB API** | Movie data source |

## 📁 Architecture

```
Showzy/
├── app/                    # Screens (file-based routing)
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Home feed
│   │   ├── search.tsx      # Search with history
│   │   ├── saved.tsx       # Offline bookmarks
│   │   └── profile.tsx     # Preferences & stats
│   ├── movies/
│   │   └── [id].tsx        # Movie details + save
│   └── _layout.tsx         # Root layout + Jotai Provider
├── components/             # Reusable UI components
│   ├── MovieCard.tsx       # Memoized movie card with animations
│   ├── TrendingCard.tsx    # Trending rank card (TypeScript)
│   ├── SearchBar.tsx       # Search input
│   ├── SearchHistory.tsx   # Persisted search chips
│   └── SkeletonLoader.tsx  # Animated shimmer skeletons
├── store/                  # Jotai atoms (state management)
│   ├── atoms.ts            # Persisted atoms (saved, history, prefs)
│   └── index.ts            # Barrel exports
├── services/               # API & data layer
│   ├── api.ts              # TMDB API with cache-first strategy
│   ├── appwrite.ts         # Appwrite backend integration
│   └── useFetch.ts         # Generic fetch hook with cleanup
├── utils/                  # Utility modules
│   ├── storage.ts          # AsyncStorage cache with TTL
│   └── haptics.ts          # Platform-safe haptic wrappers
├── interfaces/             # TypeScript type definitions
│   └── interfaces.d.ts     # Movie, TrendingMovie, etc.
└── constants/              # Static assets references
    ├── icons.ts
    └── images.ts
```

### Key Architectural Decisions

- **State Management**: Jotai with `atomWithStorage` for transparent persistence — atoms automatically sync to AsyncStorage
- **Offline-First**: API responses are cached with TTL in AsyncStorage. On network failure, stale cache is returned as fallback
- **Performance**: Components wrapped in `React.memo`, render functions stabilized with `useCallback`, skeleton loaders replace spinners
- **Native Integration**: Expo Haptics provide tactile feedback mapped to interaction importance (light → medium → heavy)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))
- Appwrite project ([setup guide](https://appwrite.io/docs))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Showzy.git
   cd Showzy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys:
   ```
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app

## 📄 License

MIT
