import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
