import { View, Text } from 'react-native';
import ThemeToggle from '../components/ThemeToggle';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="mb-4 text-2xl font-bold text-text">Hello Toggle</Text>
      <ThemeToggle />
    </View>
  );
}
