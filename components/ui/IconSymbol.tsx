// Fallback for using React Native icons on all platforms.

import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, Text, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], string>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to React Native icon mappings here.
 * - see React Native icons in the [React Native Icons](https://reactnative.dev/docs/image#source).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': '🏠',
  'paperplane.fill': '✈️',
  'chevron.left.forwardslash.chevron.right': '💻',
  'chevron.right': '▶️',
  'paintbrush.fill': '🎨',
  'camera.fill': '📷',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and emoji icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to React Native icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {MAPPING[name]}
    </Text>
  );
}