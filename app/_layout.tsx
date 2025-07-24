import { ModelProvider } from "@/providers/ModelProvider";
import { Stack } from "expo-router";
import { ThemeProvider } from "../providers/ThemeProvider";
import "./global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ModelProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ModelProvider>
    </ThemeProvider>
  );
}
