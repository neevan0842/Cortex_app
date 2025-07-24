import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import Header from "../../components/Header";
import MessageBubble from "../../components/MessageBubble";
import TypingIndicator from "../../components/TypingIndicator";
import VoiceVisualizer from "../../components/VoiceVisualizer";
import { useTheme } from "../../providers/ThemeProvider";
import { cn } from "../../utils/color-theme";

// Common Message Area Component
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

function MessageArea({
  messages,
  isTyping,
  fontSize = 16,
  mode,
  currentTranscript,
  conversationState,
}: MessageAreaProps) {
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
          <View className="px-4 py-3 rounded-2xl rounded-br-md bg-primary/20 border-2 border-primary/30">
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
}

// Chat Input Component
interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

function ChatInput({ inputValue, onInputChange, onSend }: ChatInputProps) {
  const { theme } = useTheme();

  // Get theme-aware colors for send button icon
  const getSendIconColor = () => {
    if (inputValue.trim()) {
      // Active state - always white on primary background
      return theme === "dark" ? "#1A1A1A" : "#FAFAFA";
    } else {
      // Inactive state - theme-aware muted foreground color
      return theme === "dark" ? "#B5B5B5" : "#8E8E8E";
    }
  };

  return (
    <View className="p-4 border-t border-border bg-background pb-6">
      <View className="flex-row items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
        <Pressable>
          <Icon name="paperclip" size={20} color="#8E8E8E" />
        </Pressable>

        <TextInput
          value={inputValue}
          onChangeText={onInputChange}
          onSubmitEditing={onSend}
          placeholder="Type a message..."
          placeholderTextColor="#8E8E8E"
          className="flex-1 text-foreground text-base"
          multiline
          returnKeyType="send"
          blurOnSubmit={false}
        />

        <Pressable>
          <Icon name="smile" size={20} color="#8E8E8E" />
        </Pressable>

        <Pressable
          onPress={onSend}
          disabled={!inputValue.trim()}
          className={cn(
            "p-2 rounded-full",
            inputValue.trim() ? "bg-primary" : "bg-muted"
          )}
        >
          <Icon name="send" size={16} color={getSendIconColor()} />
        </Pressable>
      </View>
    </View>
  );
}

// Talk Input Component
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
        return "volume-2";
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
        return "bg-green-500 opacity-70";
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
        return "AI is responding...";
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
          disabled={conversationState === "ai-speaking"}
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

// Main Component
type Message = {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: string;
};

const HomeScreen = () => {
  const [mode, setMode] = useState<"chat" | "talk">("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: "Hello! I'm your AI companion. How can I help you today?",
      isUser: false,
      timestamp: getCurrentTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Talk mode specific states
  const [conversationState, setConversationState] = useState<
    "ready" | "listening" | "ai-speaking"
  >("ready");
  const [currentTranscript, setCurrentTranscript] = useState("");

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const toggleMode = () => {
    setMode(mode === "chat" ? "talk" : "chat");
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      message: inputValue.trim(),
      isUser: true,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);
    Keyboard.dismiss();

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        message:
          "I understand! Let me help you with that. Here's what I can suggest...",
        isUser: false,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleMicrophoneAction = () => {
    if (conversationState === "ready") {
      startListening();
    } else if (conversationState === "listening") {
      startAIResponse();
    }
  };

  const startListening = () => {
    setConversationState("listening");
    setCurrentTranscript("Listening...");

    setTimeout(() => {
      setCurrentTranscript("Hello, I have a question about...");
    }, 1500);

    setTimeout(() => {
      setCurrentTranscript(
        "Hello, I have a question about machine learning and how it works..."
      );
    }, 3000);
  };

  const startAIResponse = () => {
    if (currentTranscript && currentTranscript !== "Listening...") {
      const userMessage = {
        id: messages.length + 1,
        message: currentTranscript,
        isUser: true,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }

    setConversationState("ai-speaking");
    setCurrentTranscript("");

    const aiResponse = {
      id: messages.length + 2,
      message:
        "Great question! Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.",
      isUser: false,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, aiResponse]);

    setTimeout(() => {
      setConversationState("ready");
    }, 4000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Common Header */}
        <Header
          mode={mode}
          onModeSwitch={toggleMode}
          conversationState={mode === "talk" ? conversationState : undefined}
        />

        {/* Common Message Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
          // Adjust this offset if you have a header
        >
          <MessageArea
            messages={messages}
            isTyping={isTyping}
            fontSize={16}
            mode={mode}
            currentTranscript={currentTranscript}
            conversationState={conversationState}
          />

          {/* Mode-specific Input Area */}
          {mode === "chat" ? (
            <ChatInput
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSend}
            />
          ) : (
            <TalkInput
              conversationState={conversationState}
              onMicrophoneAction={handleMicrophoneAction}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
