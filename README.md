# Task Manager

A simple cross-platform Task Manager built with React Native + Expo. Users can add tasks, edit them, mark them complete, and delete them, all in a clean UI.

## Screenshots

| Light mode | Dark mode |
| :---: | :---: |
| ![Light mode](./screenshots/LightTheme.jpg) | ![Dark mode](./screenshots/DarkTheme.jpg) |

| Delete Dialogs | Task Options |
| :---: | :---: |
| ![Delete Dialog](./screenshots/DeleteDialog.jpg) | ![Task Options](./screenshots/TaskOptions.jpg) |

## Features

- Add tasks with a short description
- Tap a task to toggle it between complete and incomplete (strikethrough + muted when complete)
- Edit a task's text in place
- Delete tasks, with a confirmation dialog for destructive actions
- Separate **To do** and **Completed** sections, with a collapsible Completed group and a one-tap **Clear** to remove all completed tasks
- Empty-state message when there are no tasks
- Light and dark mode, with a manual toggle in the header (defaults to the OS setting)
- Keyboard-aware input that stays docked above the keyboard

## Tech stack

- [Expo](https://expo.dev) SDK 54 with [expo-router](https://docs.expo.dev/router/introduction/) for file-based routing
- React Native 0.81 + React 19
- TypeScript (strict)
- [@expo/vector-icons](https://icons.expo.fyi/) / [expo-symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) for iconography (SF Symbols on iOS, Material Icons elsewhere)

## Getting started

Requires Node 20+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo dev server:

   ```bash
   npx expo start
   ```

3. Open the app:
   - Press `i` to launch the iOS simulator (requires Xcode)
   - Press `a` to launch an Android emulator (requires Android Studio)
   - Press `w` to open the web build
   - Or scan the QR code with [Expo Go](https://expo.dev/go) on a physical device

## Third-party libraries

No UI kit was pulled in for this project, the app uses React Native primitives. The non-template dependencies worth calling out:

- `expo`, `expo-router` — app framework and file-based navigation
- `react-native`, `react` — UI primitives
- `@react-navigation/native` — theme provider consumed by expo-router
- `@expo/vector-icons`, `expo-symbols` — iconography (SF Symbols on iOS, Material Icons elsewhere)
- `react-native-safe-area-context` — safe-area insets for the screen padding
- `react-native-keyboard-controller` — keyboard-aware layout so the input stays docked above the keyboard
- `react-native-uuid` — stable ids for new tasks without relying on array index