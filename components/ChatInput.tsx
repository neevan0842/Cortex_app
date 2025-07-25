import React from "react";
import { Pressable, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../providers/ThemeProvider";
import { cn } from "../utils/color-theme";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  fontSize?: number;
}

const ChatInput = ({
  inputValue,
  onInputChange,
  onSend,
  fontSize = 16,
}: ChatInputProps) => {
  const { theme } = useTheme();

  // Get theme-aware colors for send button icon
  const getSendIconColor = () => {
    if (inputValue.trim()) {
      return theme === "dark" ? "#1A1A1A" : "#FAFAFA";
    } else {
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
          style={{ fontSize }}
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
};

export default ChatInput;
