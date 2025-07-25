import { AVAILABLE_MODELS, Model } from "@/agent/model";
import { useAgent } from "@/providers/ModelProvider";
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

const Tools = () => {
  const { model, setModel } = useAgent();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getCurrentModel = () =>
    AVAILABLE_MODELS.find((m) => m.id === model) || AVAILABLE_MODELS[0];

  const dropdownHeight = useSharedValue(0);
  const dropdownOpacity = useSharedValue(0);
  const chevronRotation = useSharedValue(0);

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);

    // Calculate dynamic height: each item is ~64px, max 4 items (256px), with padding
    const maxHeight = Math.min(AVAILABLE_MODELS.length * 64, 288);
    dropdownHeight.value = withSpring(newState ? maxHeight : 0);
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
              Preferences
            </Text>
            <Text className="text-base text-muted-foreground">
              Customize your AI companion's capabilities
            </Text>
          </View>

          {/* Model Settings Section */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-foreground mb-4">
              Select Model
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
                            <Icon name="cpu" size={14} color="#343434" />
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

          {/* Bottom padding */}
          <View className="pb-4" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tools;
