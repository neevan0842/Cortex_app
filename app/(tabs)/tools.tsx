import { AVAILABLE_MODELS, Model } from "@/agent/model";
import { AVAILABLE_PROMPTS, PromptNames } from "@/agent/prompt";
import { useAgent } from "@/providers/ModelProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/utils/color-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

const Tools = () => {
  const { model, setModel, prompt, setPrompt } = useAgent();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPromptDropdownOpen, setIsPromptDropdownOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const { theme } = useTheme();
  const getCurrentModel = () =>
    AVAILABLE_MODELS.find((m) => m.id === model) || AVAILABLE_MODELS[0];

  const getCurrentPromptName = () =>
    AVAILABLE_PROMPTS.find((p) => p.id === prompt) || AVAILABLE_PROMPTS[0];

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);
  const chevronRotation = useSharedValue(0);

  const promptDropdownHeight = useSharedValue(0);
  const promptDropdownOpacity = useSharedValue(0);
  const promptChevronRotation = useSharedValue(0);

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);

    // Calculate dynamic height: each item is ~64px, max 4 items (256px), with padding
    const maxHeight = Math.min(AVAILABLE_MODELS.length * 64, 288);
    dropdownHeight.value = withSpring(newState ? maxHeight : 0);
    dropdownOpacity.value = withTiming(newState ? 1 : 0, { duration: 200 });
    chevronRotation.value = withSpring(newState ? 180 : 0);
  };

  const togglePromptDropdown = () => {
    const newState = !isPromptDropdownOpen;
    setIsPromptDropdownOpen(newState);

    const maxHeight = Math.min(AVAILABLE_PROMPTS.length * 48, 200);
    promptDropdownHeight.value = withSpring(newState ? maxHeight : 0);
    promptDropdownOpacity.value = withTiming(newState ? 1 : 0, {
      duration: 200,
    });
    promptChevronRotation.value = withSpring(newState ? 180 : 0);
  };

  const dropdownAnimatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: dropdownOpacity.value,
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const promptDropdownAnimatedStyle = useAnimatedStyle(() => ({
    height: promptDropdownHeight.value,
    opacity: promptDropdownOpacity.value,
  }));

  const promptChevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${promptChevronRotation.value}deg` }],
  }));

  useEffect(() => {
    AsyncStorage.setItem(PromptNames.CUSTOM_PROMPT, customPrompt);
  }, [customPrompt]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1">
            {/* Header */}
            <View className="px-6 pt-8 pb-6">
              <Text className="text-3xl font-bold text-foreground mb-2">
                Preferences
              </Text>
              <Text className="text-base text-muted-foreground">
                Customize your AI companion's capabilities
              </Text>
            </View>

            {/* Content */}
            <View className="flex-1 px-6">
              {/* Model Settings Section */}
              <View className="mb-8">
                <Text className="text-xl font-semibold text-foreground mb-4">
                  Select Model
                </Text>

                <View className="relative">
                  <Pressable
                    onPress={toggleDropdown}
                    className="flex-row items-center justify-between p-4 rounded-2xl bg-muted-foreground/40 border border-border"
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-2">
                        <Icon
                          name="cpu"
                          size={20}
                          color={theme === "dark" ? "#FAFAFA" : "#1A1A1A"}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-medium text-foreground mb-1">
                          {getCurrentModel().name}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {getCurrentModel().description}
                        </Text>
                      </View>
                    </View>

                    <Animated.View style={chevronAnimatedStyle}>
                      <Icon name="chevron-down" size={16} color="#8E8E8E" />
                    </Animated.View>
                  </Pressable>

                  {/* Dropdown */}
                  <Animated.View
                    className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg overflow-hidden"
                    pointerEvents={isDropdownOpen ? "auto" : "none"}
                    style={[
                      dropdownAnimatedStyle,
                      {
                        zIndex: 9999,
                        elevation: 9999, // For Android
                      },
                    ]}
                  >
                    <ScrollView
                      className="max-h-72"
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      <View className="p-2">
                        {AVAILABLE_MODELS.map((modelItem: Model) => (
                          <Pressable
                            key={modelItem.id}
                            onPress={() => {
                              setModel(modelItem.id);
                              toggleDropdown();
                            }}
                            className={cn(
                              "p-3 rounded-xl flex-row items-center justify-between",
                              model === modelItem.id
                                ? "bg-primary/10"
                                : "bg-transparent"
                            )}
                          >
                            <View className="flex-row items-center flex-1">
                              <View className="w-8 h-8 rounded-lg bg-primary/20 items-center justify-center mr-3">
                                <Icon
                                  name="cpu"
                                  size={14}
                                  color={
                                    theme === "dark" ? "#FAFAFA" : "#1A1A1A"
                                  }
                                />
                              </View>
                              <View>
                                <Text className="font-medium text-foreground">
                                  {modelItem.name}
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                  {modelItem.description}
                                </Text>
                              </View>
                            </View>
                            {model === modelItem.id && (
                              <View className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </Pressable>
                        ))}
                      </View>
                    </ScrollView>
                  </Animated.View>
                </View>
              </View>
              {/* Prompt Settings Section */}
              <View className="mb-8">
                <Text className="text-xl font-semibold text-foreground mb-4">
                  Prompt Selection
                </Text>

                <View className="p-4 rounded-2xl bg-muted/30 border border-border">
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-foreground mb-2">
                      Select a preconfigured prompt:
                    </Text>

                    <View className="relative">
                      <Pressable
                        onPress={togglePromptDropdown}
                        className="flex-row items-center justify-between p-3 rounded-lg bg-background border border-border"
                      >
                        <Text className="text-foreground">
                          {getCurrentPromptName().name}
                        </Text>
                        <Animated.View style={promptChevronAnimatedStyle}>
                          <Icon name="chevron-down" size={16} color="#8E8E8E" />
                        </Animated.View>
                      </Pressable>

                      {/* Prompt Dropdown */}
                      <Animated.View
                        className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
                        pointerEvents={isPromptDropdownOpen ? "auto" : "none"}
                        style={[
                          promptDropdownAnimatedStyle,
                          {
                            zIndex: 9998,
                            elevation: 9998,
                          },
                        ]}
                      >
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <View className="p-1">
                            {AVAILABLE_PROMPTS.map((promptItem) => (
                              <Pressable
                                key={promptItem.id}
                                onPress={() => {
                                  setPrompt(promptItem.id);
                                  togglePromptDropdown();
                                }}
                                className={cn(
                                  "p-3 rounded-lg",
                                  prompt === promptItem.id
                                    ? "bg-primary/10"
                                    : "bg-transparent"
                                )}
                              >
                                <Text className="text-foreground font-medium">
                                  {promptItem.name}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        </ScrollView>
                      </Animated.View>
                    </View>
                  </View>

                  <Text className="font-medium text-foreground mb-2">
                    Current Prompt
                  </Text>
                  {prompt === PromptNames.CUSTOM_PROMPT ? (
                    <TextInput
                      className="w-full h-40 bg-transparent text-foreground border border-border rounded-lg p-3"
                      placeholder="Enter your custom prompt here..."
                      placeholderTextColor="#8E8E8E"
                      value={customPrompt}
                      onChangeText={setCustomPrompt}
                      multiline
                      textAlignVertical="top"
                      scrollEnabled={true}
                    />
                  ) : (
                    <ScrollView className="w-full h-40 bg-muted/20 border border-border rounded-lg p-3">
                      <Text className="text-muted-foreground">
                        {getCurrentPromptName().description}
                      </Text>
                    </ScrollView>
                  )}
                  <Text className="text-xs text-muted-foreground mt-2">
                    This prompt will guide the AI's responses.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Tools;
