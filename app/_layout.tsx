import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/presentation/theme/tokens';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}
