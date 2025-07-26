import React from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../providers/ThemeProvider";
import { cn } from "../utils/color-theme";
import VoiceVisualizer from "./VoiceVisualizer";

interface TalkInputProps {
  conversationState: "ready" | "listening" | "ai-speaking";
  onMicrophoneAction: () => void;
}

function TalkInput({ conversationState, onMicrophoneAction }: TalkInputProps) {
  const { theme } = useTheme();

  const getButtonIcon = () => {
    switch (conversationState) {
      case "ready":
        return "mic";
      case "listening":
        return "mic-off";
      case "ai-speaking":
        return "square"; // Stop/interrupt icon
      default:
        return "mic";
    }
  };

  const getButtonStyle = () => {
    switch (conversationState) {
      case "ready":
        return "bg-primary";
      case "listening":
        return "bg-red-500";
      case "ai-speaking":
        return "bg-orange-500"; // Orange for interrupt action
      default:
        return "bg-primary";
    }
  };

  const getInstructions = () => {
    switch (conversationState) {
      case "ready":
        return "Tap to start speaking";
      case "listening":
        return "Speak clearly, tap when finished";
      case "ai-speaking":
        return "AI is responding... Tap to interrupt";
      default:
        return "Ready for conversation";
    }
  };

  return (
    <View className="border-t border-border bg-background p-6 space-y-4">
      <View className="w-full max-w-xs mx-auto">
        <VoiceVisualizer
          isActive={
            conversationState === "listening" ||
            conversationState === "ai-speaking"
          }
          bars={15}
        />
      </View>

      <View className="items-center">
        <Pressable
          onPress={onMicrophoneAction}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-lg",
            getButtonStyle()
          )}
        >
          <Icon
            name={getButtonIcon()}
            size={24}
            color={theme === "dark" ? "#1A1A1A" : "#FAFAFA"}
          />
        </Pressable>
      </View>

      <Text className="text-xs text-muted-foreground text-center mt-2">
        {getInstructions()}
      </Text>
    </View>
  );
}

export default TalkInput;
