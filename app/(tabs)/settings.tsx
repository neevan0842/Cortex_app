import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import ToggleSwitch from "../../components/ToggleSwitch";
import { useTheme } from "../../providers/ThemeProvider";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Settings
          </Text>
          <Text className="text-base text-muted-foreground">
            Customize your experience
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6">
          {/* Appearance Section */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-foreground mb-4">
              Appearance
            </Text>

            <View className="flex-row items-center justify-between py-5 px-5 rounded-2xl bg-muted-foreground/40 border border-border/50">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-2">
                  <Icon
                    name={isDark ? "moon" : "sun"}
                    size={20}
                    color={isDark ? "#EBEBEB" : "#343434"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-medium text-foreground mb-1">
                    {isDark ? "Dark Mode" : "Light Mode"}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Toggle theme
                  </Text>
                </View>
              </View>

              <ToggleSwitch value={isDark} onValueChange={toggleTheme} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
