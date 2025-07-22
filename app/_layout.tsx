import { Stack } from "expo-router";
import { ThemeProvider } from "../providers/ThemeProvider";
import "./global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}
