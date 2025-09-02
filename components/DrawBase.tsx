import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

type DrawerSide = 'left' | 'right';

export type DrawerBaseContext = {
  close: () => void;
  isOpen: boolean;
};

type DrawerBaseProps = {
  isOpen: boolean;
  onClose: () => void;

  /** Width in px or percentage string (e.g. '75%'). Default '75%'. */
  width?: number | `${number}%`;

  /** Which edge the drawer slides from. Default 'left'. */
  side?: DrawerSide;

  /** Animation duration (ms). Default 300. */
  duration?: number;

  /** Backdrop color/opacity. Default rgba(0,0,0,0.3). */
  backdropColor?: string;

  /** If true, tapping backdrop closes. Default true. */
  closeOnBackdropPress?: boolean;

  /** Optional slot renderers OR use children. */
  renderHeader?: (ctx: DrawerBaseContext) => React.ReactNode;
  renderContent?: (ctx: DrawerBaseContext) => React.ReactNode;
  renderFooter?: (ctx: DrawerBaseContext) => React.ReactNode;
  children?: React.ReactNode;

  /** Style overrides. */
  styles?: Partial<{
    root: ViewStyle;
    backdrop: ViewStyle;
    drawer: ViewStyle;
    header: ViewStyle;
    content: ViewStyle;
    footer: ViewStyle;
  }>;
};

function parseWidth(w?: number | `${number}%`) {
  if (typeof w === 'number') return w;
  if (typeof w === 'string' && w.endsWith('%')) {
    const pct = parseFloat(w);
    if (!Number.isNaN(pct)) return (pct / 100) * SCREEN_WIDTH;
  }
  return 0.75 * SCREEN_WIDTH;
}

export default function DrawerBase({
  isOpen,
  onClose,
  width = '75%',
  side = 'left',
  duration = 300,
  backdropColor = 'rgba(0,0,0,0.3)',
  closeOnBackdropPress = true,
  renderHeader,
  renderContent,
  renderFooter,
  children,
  styles: stylesOverride = {},
}: DrawerBaseProps) {
  const drawerWidth = useMemo(() => parseWidth(width), [width]);
  const offscreenX = side === 'left' ? -drawerWidth : drawerWidth;

  const translateX = useRef(new Animated.Value(isOpen ? 0 : offscreenX)).current;
  const [mounted, setMounted] = useState(isOpen);

  // Mount/unmount with animation
  useEffect(() => {
    if (isOpen) setMounted(true);

    Animated.timing(translateX, {
      toValue: isOpen ? 0 : offscreenX,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (!isOpen) setMounted(false);
    });
    // NOTE: depends only on isOpen/offscreenX/duration, *not* on arbitrary app state
  }, [isOpen, offscreenX, duration, translateX]);

  const ctx: DrawerBaseContext = { close: onClose, isOpen };

  if (!mounted) return null;

  return (
    <View style={[StyleSheet.absoluteFill, stylesOverride.root]}>
      {/* Backdrop */}
      <TouchableWithoutFeedback
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <View
          style={[
            styles.backdrop,
            { backgroundColor: backdropColor },
            stylesOverride.backdrop,
          ]}
          // Accessibility: treat as modal scrim
          accessibilityLabel="Close drawer"
          accessibilityRole="button"
          importantForAccessibility="yes"
          accessibilityViewIsModal
        />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            [side]: 0,
            transform: [{ translateX }],
          },
          stylesOverride.drawer,
        ]}
      >
        {/* Optional slots */}
        {renderHeader ? (
          <View style={[styles.header, stylesOverride.header]}>
            {renderHeader(ctx)}
          </View>
        ) : null}

        <View style={[styles.content, stylesOverride.content]}>
          {renderContent ? renderContent(ctx) : children}
        </View>

        {renderFooter ? (
          <View style={[styles.footer, stylesOverride.footer]}>
            {renderFooter(ctx)}
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    // elevation for Android
    elevation: 12,
  } as ViewStyle,
  header: { marginBottom: 20 },
  content: { flex: 1 },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingTop: 12,
    marginBottom: 24,
  },
});
