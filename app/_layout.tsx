import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { ConfirmProvider } from '@/components/confirm-dialog';
import { AppThemeProvider, useAppTheme } from '@/components/theme-context';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <AppThemeProvider>
        <ConfirmProvider>
          <ThemedNavigation />
        </ConfirmProvider>
      </AppThemeProvider>
    </KeyboardProvider>
  );
}

function ThemedNavigation() {
  const { scheme } = useAppTheme();
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
