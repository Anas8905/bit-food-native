import { View } from "react-native";

type TabBarIconProps = {
  Icon: React.ComponentType<{ width?: number; height?: number; color?: string }>;
  color: string;
  size: number,
  focused: boolean;
};

export function TabBarIcon({ Icon, color, size, focused }: TabBarIconProps): React.JSX.Element {
  return (
    <View
      style={{
        padding: 8,
        borderRadius: 50,
        backgroundColor: focused ? '#FA4F0C' : "transparent",
      }}
    >
      <Icon width={size} height={size} color={color} />
    </View>
  );
}
