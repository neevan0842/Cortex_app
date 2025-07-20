import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-600 mb-4">
        Welcome to NativeWind!
      </Text>
      <Text className="text-lg text-gray-700 text-center px-4">
        Edit app/index.tsx to edit this screen.
      </Text>
      <View className="mt-6 px-6 py-3 bg-blue-500 rounded-lg">
        <Text className="text-white font-semibold">
          NativeWind is working! 🎉
        </Text>
      </View>
    </View>
  );
}
