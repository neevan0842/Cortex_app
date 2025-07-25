import { useAgent } from "@/providers/ModelProvider";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import ChatInput from "../../components/ChatInput";
import Header from "../../components/Header";
import MessageArea from "../../components/MessageArea";
import VoiceVisualizer from "../../components/VoiceVisualizer";
import { useTheme } from "../../providers/ThemeProvider";
import { cn } from "../../utils/color-theme";

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
  const [fontSize, setFontSize] = useState(15);
  const { generateLLMResponse } = useAgent();
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

  const handleSend = async () => {
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

    const aiResponse = {
      id: messages.length + 2,
      message: await generateLLMResponse(inputValue.trim()),
      isUser: false,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
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
            fontSize={fontSize}
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
              fontSize={fontSize}
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
