import React, { useEffect, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface MessageAreaProps {
  messages: Array<{
    id: number;
    message: string;
    isUser: boolean;
    timestamp: string;
  }>;
  isTyping: boolean;
  fontSize?: number;
  mode: "chat" | "talk";
  currentTranscript?: string;
  conversationState?: "ready" | "listening" | "ai-speaking";
}

const MessageArea = ({
  messages,
  isTyping,
  fontSize = 15,
  mode,
  currentTranscript,
  conversationState,
}: MessageAreaProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping, currentTranscript]);

  const LiveTranscript = () => {
    const dots = [
      useSharedValue(0.3),
      useSharedValue(0.3),
      useSharedValue(0.3),
    ];

    React.useEffect(() => {
      dots.forEach((dot, i) => {
        dot.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 333 }),
            withTiming(0.3, { duration: 333 })
          ),
          -1,
          false
        );
      });
    }, []);

    return (
      <Animated.View className="flex-row-reverse gap-3 mb-4">
        <View className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center">
          <Icon name="user" size={16} color="#FAFAFA" />
        </View>
        <View className="max-w-[75%] space-y-1 items-end">
          <View className="px-4 py-3 rounded-2xl rounded-br-md bg-primary/20 border-2 border-border">
            <Text
              className="leading-relaxed text-foreground"
              style={{ fontSize }}
            >
              {currentTranscript}
            </Text>
            <View className="flex-row gap-1 mt-2">
              {dots.map((dot, i) => {
                const animatedStyle = useAnimatedStyle(() => ({
                  opacity: dot.value,
                }));
                return (
                  <Animated.View
                    key={i}
                    className="w-1 h-1 bg-primary rounded-full"
                    style={animatedStyle}
                  />
                );
              })}
            </View>
          </View>
          <Text className="text-xs text-muted-foreground px-2">
            Speaking...
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 p-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg.message}
          isUser={msg.isUser}
          timestamp={msg.timestamp}
          fontSize={fontSize}
        />
      ))}
      {isTyping && <TypingIndicator />}
      {mode === "talk" &&
        currentTranscript &&
        conversationState === "listening" && <LiveTranscript />}
    </ScrollView>
  );
};

export default MessageArea;
