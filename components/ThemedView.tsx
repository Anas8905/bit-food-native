import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps): React.JSX.Element{
  const backgroundColor = useThemeColor(
    {
      ...(lightColor && { light: lightColor }),
      ...(darkColor && { dark: darkColor }),
    },
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
