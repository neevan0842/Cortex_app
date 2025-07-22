import { cn } from "@/utils/color-theme";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../../providers/ThemeProvider";

// Reusable TabBarIcon component
function TabBarIcon({
  iconName,
  label,
  focused,
}: {
  iconName: string;
  label: string;
  focused: boolean;
}) {
  const { theme } = useTheme();

  // Get theme-aware colors
  const iconColor = focused
    ? theme === "dark"
      ? "#EBEBEB"
      : "#343434" // primary color
    : theme === "dark"
      ? "#B5B5B5"
      : "#8E8E8E"; // muted-foreground color

  return (
    <View className="flex flex-col items-center justify-center w-20 h-full mt-5">
      <Icon name={iconName} size={22} color={iconColor} />
      <Text
        numberOfLines={1}
        className={cn(
          focused
            ? "text-primary font-bold"
            : "text-muted-foreground font-medium text-sm"
        )}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          borderTopColor: "#0061FF1A",
          height: 60,
        },
        tabBarActiveTintColor: 'transparent',
        tabBarInactiveTintColor: 'transparent',
        tabBarButton: (props) => {
          const { children, onPress, accessibilityState, ...restProps } = props;
          return (
            <Pressable
              onPress={onPress}
              style={[restProps.style, { backgroundColor: 'transparent', flex: 1 }]}
              android_ripple={{ color: 'transparent' }}
            >
              {children}
            </Pressable>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="tool" label="Tools" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              iconName="settings"
              label="Settings"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
