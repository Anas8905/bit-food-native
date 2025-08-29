import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Direction = 'up' | 'down' | 'left' | 'right';

interface SwipableModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
  onSwipeComplete?: () => void;
  swipeDirection?: Direction | Direction[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

type SwipableModalPropsWithModal = SwipableModalProps & Partial<Omit<ModalProps, keyof SwipableModalProps>>;

export default function SwipableModal({
  isVisible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.9,
  onBackdropPress,
  onBackButtonPress,
  onSwipeComplete,
  swipeDirection = ['down'],
  style,
  contentStyle,
  ...modalProps
}: SwipableModalPropsWithModal) {
  const createHandler = (customHandler?: () => void) => () => {
    customHandler ? customHandler() : onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={createHandler(onBackdropPress)}
      onBackButtonPress={createHandler(onBackButtonPress)}
      onSwipeComplete={createHandler(onSwipeComplete)}
      swipeDirection={swipeDirection}
      style={[styles.modal, style]}
      {...modalProps}
    >
      <View style={[styles.modalContent, { height }, contentStyle]}>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
