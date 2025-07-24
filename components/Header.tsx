import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface HeaderProps {
  mode: "chat" | "talk";
  onModeSwitch: () => void;
  conversationState?: "ready" | "listening" | "ai-speaking";
}

const Header = ({ mode, onModeSwitch, conversationState }: HeaderProps) => {
  const { theme } = useTheme();
  const getStatusText = () => {
    if (mode === "talk" && conversationState) {
      switch (conversationState) {
        case "ready":
          return "Ready to talk";
        case "listening":
          return "Listening...";
        case "ai-speaking":
          return "I'm speaking...";
        default:
          return "Ready to talk";
      }
    }
    return "Online";
  };

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-border bg-background">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Icon
            name="cpu"
            size={20}
            color={theme === "dark" ? "#1A1A1A" : "#FAFAFA"}
          />
        </View>
        <View>
          <Text className="font-semibold text-foreground">Cortex</Text>
          <Text className="text-xs text-muted-foreground">
            {getStatusText()}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onModeSwitch}
        className="flex-row items-center gap-2 px-4 py-2 rounded-full shadow-lg"
        style={{
          backgroundColor: mode === "chat" ? "#22C55E" : "#EF4444",
          shadowColor: mode === "chat" ? "#22C55E" : "#EF4444",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Icon
          name={mode === "chat" ? "phone" : "message-circle"}
          size={14}
          color="#FFFFFF"
        />
        <Text className="text-sm font-bold text-white">
          {mode === "chat" ? "Talk" : "Chat"}
        </Text>
      </Pressable>
    </View>
  );
};

export default Header;
