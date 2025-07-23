import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { themes } from "../utils/color-theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme === "dark" || savedTheme === "light") {
          setCurrentTheme(savedTheme);
          // Apply the theme immediately
          try {
            colorScheme.set(savedTheme);
          } catch (error) {
            console.warn("Failed to set color scheme:", error);
            // Fallback for web
            if (typeof document !== "undefined") {
              if (savedTheme === "dark") {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load theme from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  console.log("ThemeProvider - currentTheme:", currentTheme);

  const toggleTheme = async () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);

    // Save theme to storage
    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Failed to save theme to storage:", error);
    }

    // Apply the theme
    try {
      colorScheme.set(newTheme);
    } catch (error) {
      console.warn("Failed to set color scheme:", error);
      // Fallback: manually update the document class for web
      if (typeof document !== "undefined") {
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    }
  };

  // Show loading state while theme is being loaded
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {/* Simple loading state */}
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <View style={themes[currentTheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
