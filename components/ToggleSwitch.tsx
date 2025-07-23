import { cn } from "@/utils/color-theme";
import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Animated Toggle Switch Component
interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ToggleSwitch({
  value,
  onValueChange,
}: ToggleSwitchProps) {
  const translateX = useSharedValue(value ? 28 : 4);

  React.useEffect(() => {
    translateX.value = withSpring(value ? 28 : 4, {
      damping: 30,
      stiffness: 500,
    });
  }, [value, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className={cn(
        "w-16 h-9 rounded-full relative",
        value ? "bg-primary" : "bg-primary-foreground border border-border"
      )}
    >
      <Animated.View
        style={[animatedStyle]}
        className={cn(
          "size-7 rounded-full absolute top-1",
          value ? "bg-primary-foreground" : "bg-muted-foreground"
        )}
      />
    </Pressable>
  );
}
