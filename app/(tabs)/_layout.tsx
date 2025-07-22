import { cn } from "@/utils/color-theme";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

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
  return (
    <View className="flex items-center justify-center w-20 mt-4">
      <Icon
        name={iconName}
        size={22}
        className={cn(
          "flex items-center justify-center",
          focused ? "text-primary" : "text-secondary"
        )}
      />
      <Text
        numberOfLines={1}
        className={cn(
          "text-xs font-medium mt-1",
          focused ? "text-primary" : "text-text"
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
          height: 55,
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
