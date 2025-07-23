import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";
import { cn } from "../../utils/color-theme";
import MessageBubble from "../../components/MessageBubble";
import TypingIndicator from "../../components/TypingIndicator";
import VoiceVisualizer from "../../components/VoiceVisualizer";

// Chat Mode Component
interface ChatModeProps {
  onModeSwitch: () => void;
  fontSize?: number;
}

function ChatMode({ onModeSwitch, fontSize = 16 }: ChatModeProps) {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hello! I'm your AI companion. How can I help you today?",
      isUser: false,
      timestamp: getCurrentTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      message: inputValue,
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
        message: "I understand! Let me help you with that. Here's what I can suggest...",
        isUser: false,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      className="flex-1"
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-border bg-background">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Icon name="cpu" size={20} color="#FAFAFA" />
            </View>
            <View>
              <Text className="font-semibold text-foreground">Cortex</Text>
              <Text className="text-xs text-muted-foreground">Online</Text>
            </View>
          </View>

          <Pressable
            onPress={onModeSwitch}
            className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
          >
            <Icon name="phone" size={16} color="#8E8E8E" />
            <Text className="text-xs text-muted-foreground">Talk</Text>
          </Pressable>
        </View>

        {/* Messages */}
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
        </ScrollView>

        {/* Input Area */}
        <View className="p-4 border-t border-border bg-background pb-8">
          <View className="flex-row items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/50">
            <Pressable>
              <Icon name="paperclip" size={20} color="#8E8E8E" />
            </Pressable>

            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSend}
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
              onPress={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                "p-2 rounded-full",
                inputValue.trim()
                  ? "bg-primary"
                  : "bg-muted"
              )}
            >
              <Icon
                name="send"
                size={16}
                color={inputValue.trim() ? "#FAFAFA" : "#8E8E8E"}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Talk Mode Component
interface TalkModeProps {
  onModeSwitch: () => void;
  fontSize?: number;
}

type ConversationItem = {
  id: number;
  type: "ai" | "user";
  text: string;
  timestamp: string;
};

function TalkMode({ onModeSwitch, fontSize = 16 }: TalkModeProps) {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [conversationState, setConversationState] = useState<"ready" | "listening" | "ai-speaking">("ready");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [conversation, setConversation] = useState<ConversationItem[]>([
    {
      id: 1,
      type: "ai" as const,
      text: "Hi! I'm ready to talk. Just tap the microphone to start our conversation.",
      timestamp: getCurrentTime(),
    },
  ]);

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
      setCurrentTranscript("Hello, I have a question about machine learning and how it works...");
    }, 3000);
  };

  const startAIResponse = () => {
    if (currentTranscript && currentTranscript !== "Listening...") {
      const userMessage = {
        id: conversation.length + 1,
        type: "user" as const,
        text: currentTranscript,
        timestamp: getCurrentTime(),
      };
      setConversation((prev) => [...prev, userMessage]);
    }

    setConversationState("ai-speaking");
    setCurrentTranscript("");

    const aiResponse = {
      id: conversation.length + 2,
      type: "ai" as const,
      text: "Great question! Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.",
      timestamp: getCurrentTime(),
    };
    setConversation((prev) => [...prev, aiResponse]);

    setTimeout(() => {
      setConversationState("ready");
    }, 4000);
  };

  const getStatusText = () => {
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
  };

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

  const LiveTranscript = () => {
    const dots = [useSharedValue(0.3), useSharedValue(0.3), useSharedValue(0.3)];

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
            <Text className="leading-relaxed text-foreground" style={{ fontSize }}>
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
          <Text className="text-xs text-muted-foreground px-2">Speaking...</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-border bg-background">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Icon name="cpu" size={20} color="#FAFAFA" />
          </View>
          <View>
            <Text className="font-semibold text-foreground">Cortex</Text>
            <Text className="text-xs text-muted-foreground">{getStatusText()}</Text>
          </View>
        </View>

        <Pressable
          onPress={onModeSwitch}
          className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
        >
          <Icon name="message-circle" size={16} color="#8E8E8E" />
          <Text className="text-xs text-muted-foreground">Chat</Text>
        </Pressable>
      </View>

      {/* Conversation Area */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {conversation.map((item) => (
          <MessageBubble
            key={item.id}
            message={item.text}
            isUser={item.type === "user"}
            timestamp={item.timestamp}
            fontSize={fontSize}
          />
        ))}

        {currentTranscript && conversationState === "listening" && <LiveTranscript />}
      </ScrollView>

      {/* Voice Interface */}
      <View className="border-t border-border bg-background p-6 space-y-4">
        <View className="w-full max-w-xs mx-auto">
          <VoiceVisualizer
            isActive={conversationState === "listening" || conversationState === "ai-speaking"}
            bars={15}
          />
        </View>

        <View className="items-center">
          <Pressable
            onPress={handleMicrophoneAction}
            disabled={conversationState === "ai-speaking"}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center shadow-lg",
              getButtonStyle()
            )}
          >
            <Icon name={getButtonIcon()} size={24} color="#FAFAFA" />
          </Pressable>
        </View>

        <Text className="text-xs text-muted-foreground text-center">{getInstructions()}</Text>
      </View>
    </View>
  );
}

// Main Component
const HomeScreen = () => {
  const [mode, setMode] = useState<"chat" | "talk">("chat");

  const toggleMode = () => {
    setMode(mode === "chat" ? "talk" : "chat");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {mode === "chat" ? (
        <ChatMode onModeSwitch={toggleMode} />
      ) : (
        <TalkMode onModeSwitch={toggleMode} />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
