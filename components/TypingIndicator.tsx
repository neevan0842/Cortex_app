import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";

const TypingIndicator = () => {
  const dots = [useSharedValue(0.3), useSharedValue(0.3), useSharedValue(0.3)];

  React.useEffect(() => {
    dots.forEach((dot, i) => {
      dot.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        false
      );
    });
  }, []);

  return (
    <Animated.View className="flex-row items-center gap-3 mb-4">
      <View className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <Icon name="cpu" size={16} color="#8E8E8E" />
      </View>
      <View className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
        <View className="flex-row gap-1">
          {dots.map((dot, i) => {
            const animatedStyle = useAnimatedStyle(() => ({
              opacity: dot.value,
            }));
            return (
              <Animated.View
                key={i}
                className="w-2 h-2 bg-muted-foreground rounded-full"
                style={animatedStyle}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

export default TypingIndicator;
