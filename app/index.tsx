import { useTheme } from "@/contexts/ThemeProvider";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { toggleTheme } = useTheme(); // Ensure the theme context is used
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-primary-foreground text-xl">
        Welcome to the Home Page!
      </Text>
      <Pressable
        onPress={toggleTheme}
        className="mt-4 px-4 py-2 bg-primary rounded"
      >
        <Text className="text-primary-foreground">Toggle Theme</Text>
      </Pressable>
    </View>
  );
}
