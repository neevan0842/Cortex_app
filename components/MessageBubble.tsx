import React from "react";
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";
import { cn } from "../utils/color-theme";

// Message Bubble Component
interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  fontSize?: number;
}

function MessageBubble({ message, isUser, timestamp, fontSize = 16 }: MessageBubbleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={cn("flex-row gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <View
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-primary" : "bg-muted"
        )}
      >
        <Icon
          name={isUser ? "user" : "cpu"}
          size={16}
          color={isUser ? "#FAFAFA" : "#8E8E8E"}
        />
      </View>

      <View className={cn("max-w-[75%] space-y-1", isUser ? "items-end" : "items-start")}>
        <View
          className={cn(
            "px-4 py-3 rounded-2xl",
            isUser
              ? "bg-primary rounded-br-md"
              : "bg-muted/50 rounded-bl-md"
          )}
        >
          <Text
            className={cn("leading-relaxed", isUser ? "text-primary-foreground" : "text-foreground")}
            style={{ fontSize }}
          >
            {message}
          </Text>
        </View>
        <Text className="text-xs text-muted-foreground px-2">{timestamp}</Text>
      </View>
    </Animated.View>
  );
}

export default MessageBubble;
