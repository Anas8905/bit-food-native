import { isAndroid } from '@/utils/common.utils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  /** If true, prevents state updates during navigation. Default false. */
  preventUpdates?: boolean;

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
  preventUpdates = false,
  renderHeader,
  renderContent,
  renderFooter,
  children,
  styles: stylesOverride = {},
}: DrawerBaseProps) {
  const drawerWidth = useMemo(() => parseWidth(width), [width]);
  const offscreenX = side === 'left' ? -drawerWidth : drawerWidth;

  const translateX = useRef(new Animated.Value(offscreenX)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Animation callback to avoid useInsertionEffect warnings
  const handleAnimationComplete = useCallback(() => {
    // Only update state if component is still mounted and animation is still relevant
    if (!isOpen && isMountedRef.current && !preventUpdates) {
      setMounted(false);
    }
  }, [isOpen, preventUpdates]);

  // Mount/unmount with animation
  useEffect(() => {
    // Skip updates if preventUpdates is true
    if (preventUpdates) return;

    let translateAnimation: Animated.CompositeAnimation | null = null;
    let opacityAnimation: Animated.CompositeAnimation | null = null;

    if (isOpen) {
      setMounted(true);
      // Start from offscreen position and animate to center
      translateX.setValue(offscreenX);
      backdropOpacity.setValue(0);

      requestAnimationFrame(() => {
        // Animate both translateX and backdrop opacity
        translateAnimation = Animated.timing(translateX, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        });

        opacityAnimation = Animated.timing(backdropOpacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        });

        // Run both animations in parallel
        Animated.parallel([translateAnimation, opacityAnimation]).start();
      });
    } else if (mounted) {
      // Animate to offscreen position
      translateAnimation = Animated.timing(translateX, {
        toValue: offscreenX,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      opacityAnimation = Animated.timing(backdropOpacity, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      });

      // Run both animations in parallel
      Animated.parallel([translateAnimation, opacityAnimation]).start(handleAnimationComplete);
    }

    // Cleanup animations on unmount or dependency change
    return () => {
      if (translateAnimation) {
        translateAnimation.stop();
      }
      if (opacityAnimation) {
        opacityAnimation.stop();
      }
    };
  }, [isOpen, offscreenX, duration, translateX, backdropOpacity, handleAnimationComplete, preventUpdates, mounted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const ctx: DrawerBaseContext = { close: onClose, isOpen };

  if (preventUpdates) return null;

  if (!mounted) return null;

  return (
    <View style={[StyleSheet.absoluteFill, stylesOverride.root]}>
      {/* Backdrop */}
      <TouchableWithoutFeedback
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              backgroundColor: backdropColor,
              opacity: backdropOpacity,
            },
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
    zIndex: 2,
    backgroundColor: '#fff',
    paddingTop: isAndroid ? 30 : 60,
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
