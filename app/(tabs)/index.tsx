import { useAgent } from "@/providers/ModelProvider";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
} from "expo-audio";
import React, { useEffect, useRef, useState } from "react";
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
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer();
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
  const hasFinishedRef = useRef(false);

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
    } else if (conversationState === "ai-speaking") {
      interruptAIResponse();
    }
  };

  const startListening = async () => {
    setConversationState("listening");
    setCurrentTranscript("Listening...");
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        console.warn("Permission to access microphone not granted");
        setConversationState("ready");
        return;
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error("Error preparing audio recorder:", error);
      setConversationState("ready");
      return;
    }
  };

  const startAIResponse = async () => {
    try {
      // The recording will be available on `audioRecorder.uri`.
      await audioRecorder.stop();
      console.log("Audio recording stopped:", audioRecorder.uri);

      // Reset the finished flag for new playback
      hasFinishedRef.current = false;

      setConversationState("ai-speaking");
      setCurrentTranscript("");

      // Replace the player source with the new recording
      if (audioRecorder.uri) {
        player.replace(audioRecorder.uri);
        player.play();
      } else {
        console.error("No recording URI available");
        setConversationState("ready");
      }
    } catch (error) {
      setConversationState("ready");
      console.error("Error starting AI response:", error);
      return;
    }
  };

  const interruptAIResponse = () => {
    player.pause();
    setConversationState("ready");
    setCurrentTranscript("");
  };

  // Replace the existing useEffect with this corrected version
  useEffect(() => {
    const statusSubscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        // Only trigger once per playback using the ref
        if (status.playbackState === "ended" && !hasFinishedRef.current) {
          console.log("Audio finished via onPlaybackStatusUpdate");
          hasFinishedRef.current = true; // Prevent multiple triggers
          setConversationState("ready");
        }
      }
    );

    return () => statusSubscription.remove();
  }, [player]);

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
