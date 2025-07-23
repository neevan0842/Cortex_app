import { cn } from "@/utils/color-theme";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import ToggleSwitch from "../../components/ToggleSwitch";

interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
}

const Tools = () => {
  const [enabledTools, setEnabledTools] = useState({
    search: true,
    calendar: true,
    calculator: false,
    weather: true,
    notes: false,
    timer: true,
  });

  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tools: Tool[] = [
    {
      id: "search",
      name: "Web Search",
      icon: "search",
      description: "Search the internet",
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: "calendar",
      description: "Manage your schedule",
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: "plus",
      description: "Perform calculations",
    },
    {
      id: "weather",
      name: "Weather",
      icon: "sun",
      description: "Get weather updates",
    },
    {
      id: "notes",
      name: "Notes",
      icon: "message-circle",
      description: "Take and manage notes",
    },
    {
      id: "timer",
      name: "Timer",
      icon: "clock",
      description: "Set timers and alarms",
    },
  ];

  const models: Model[] = [
    { id: "gpt-4", name: "GPT-4", description: "Most capable model" },
    { id: "gpt-3.5", name: "GPT-3.5", description: "Faster responses" },
  ];

  const getCurrentModel = () =>
    models.find((model) => model.id === selectedModel) || models[0];

  const toggleTool = (toolId: string) => {
    setEnabledTools((prev) => ({
      ...prev,
      [toolId]: !prev[toolId as keyof typeof prev],
    }));
  };

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);
  const chevronRotation = useSharedValue(0);

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);

    dropdownHeight.value = withSpring(newState ? 135 : 0);
    dropdownOpacity.value = withTiming(newState ? 1 : 0, { duration: 200 });
    chevronRotation.value = withSpring(newState ? 180 : 0);
  };

  const dropdownAnimatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: dropdownOpacity.value,
  }));

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isDropdownOpen ? 200 : 20 }}
      >
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Tools & Settings
            </Text>
            <Text className="text-base text-muted-foreground">
              Customize your AI companion's capabilities
            </Text>
          </View>

          {/* Available Tools Section */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-foreground mb-4">
              Available Tools
            </Text>

            <View className="space-y-3">
              {tools.map((tool) => (
                <View
                  key={tool.id}
                  className="flex-row items-center justify-between py-4 px-5 rounded-2xl bg-muted/40 border border-border/50 mb-4"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                      <Icon name={tool.icon} size={18} color="#8E8E8E" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-foreground text-lg mb-1">
                        {tool.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {tool.description}
                      </Text>
                    </View>
                  </View>

                  <ToggleSwitch
                    value={enabledTools[tool.id as keyof typeof enabledTools]}
                    onValueChange={() => toggleTool(tool.id)}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Model Settings Section */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-foreground mb-4">
              Model Settings
            </Text>

            <View className="relative">
              <Pressable
                onPress={toggleDropdown}
                className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 items-center justify-center mr-4">
                    <Icon name="cpu" size={18} color="#343434" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-foreground text-base mb-1">
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
                <View className="p-2">
                  {models.map((model) => (
                    <Pressable
                      key={model.id}
                      onPress={() => {
                        setSelectedModel(model.id);
                        toggleDropdown();
                      }}
                      className={cn(
                        "p-3 rounded-xl flex-row items-center justify-between",
                        selectedModel === model.id
                          ? "bg-primary/10"
                          : "bg-transparent"
                      )}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 rounded-lg bg-primary/20 items-center justify-center mr-3">
                          <Icon name="cpu" size={14} color="#343434" />
                        </View>
                        <View>
                          <Text className="font-medium text-foreground">
                            {model.name}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {model.description}
                          </Text>
                        </View>
                      </View>
                      {selectedModel === model.id && (
                        <View className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Bottom padding */}
          <View className="pb-4" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tools;
