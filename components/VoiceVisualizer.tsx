import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

// Voice Visualizer Component
interface VoiceVisualizerProps {
  isActive: boolean;
  bars?: number;
}

function VoiceVisualizer({ isActive, bars = 20 }: VoiceVisualizerProps) {
  const animatedBars = Array.from({ length: bars }).map(() => {
    const height = useSharedValue(8);
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
      if (isActive) {
        height.value = withRepeat(
          withSequence(
            withTiming(Math.random() * 40 + 20, { duration: 400 }),
            withTiming(8, { duration: 400 })
          ),
          -1,
          false
        );
        opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.3, { duration: 400 })
          ),
          -1,
          false
        );
      } else {
        height.value = withTiming(8, { duration: 300 });
        opacity.value = withTiming(0.3, { duration: 300 });
      }
    }, [isActive]);

    return { height, opacity };
  });

  return (
    <View className="flex-row items-center justify-center gap-1 h-16">
      {animatedBars.map((bar, i) => {
        const animatedStyle = useAnimatedStyle(() => ({
          height: bar.height.value,
          opacity: bar.opacity.value,
        }));

        return (
          <Animated.View
            key={i}
            className="w-1 bg-primary rounded-full"
            style={[animatedStyle, { minHeight: 8 }]}
          />
        );
      })}
    </View>
  );
}

export default VoiceVisualizer;
