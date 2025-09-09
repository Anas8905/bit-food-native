import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

const { width: screenWidth } = Dimensions.get('window');

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
  type = 'default'
}) => {
  const [useHorizontalLayout, setUseHorizontalLayout] = useState(true);

  useEffect(() => {
    if (buttons.length === 2) {
      const hasLongText = buttons.some(button => button.text.length > 10);
      setUseHorizontalLayout(!hasLongText);
    }
  }, [buttons]);

  const renderButton = (button: AlertButton, index: number): React.JSX.Element => {
    const isDestructive = button.style === 'destructive';
    const isCancelButton = button.style === 'cancel';
    const isLastButton = index === buttons.length - 1;
    const isTwoButtonsVertical = buttons.length === 2 && !useHorizontalLayout;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.button,
          buttons.length === 1 && styles.singleButton,
          buttons.length === 2 && useHorizontalLayout && index === 0 && styles.leftButton,
          buttons.length === 2 && useHorizontalLayout && index === 1 && styles.rightButton,
          isTwoButtonsVertical && !isLastButton && styles.buttonWithBorder,
          buttons.length > 2 && !isLastButton && styles.buttonWithBorder,
        ]}
        onPress={() => {
          if (button.onPress) button.onPress();
          if (onDismiss) onDismiss();
        }}
        activeOpacity={0.6}
      >
        <Text
          style={[
            styles.buttonText,
            isDestructive && styles.destructiveButtonText,
            isCancelButton && styles.cancelButtonText,
            button.style === 'default' && styles.defaultButtonText,
          ]}
        >
          {button.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.6}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={200}
      animationInTiming={200}
      animationOutTiming={200}
      // onBackdropPress={onDismiss}
      onBackButtonPress={onDismiss}
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Title */}
          {title && (
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          )}

          {/* Message */}
          {message && (
            <Text style={styles.message} numberOfLines={4}>
              {message}
            </Text>
          )}

          {/* Buttons */}
          <View style={[
            styles.buttonContainer,
            buttons.length === 2 && useHorizontalLayout && styles.horizontalButtonContainer
          ]}>
            {buttons.map(renderButton)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const useCustomAlert = (): UseCustomAlertReturn => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (
    title?: string,
    message?: string,
    buttons: AlertButton[] = [{ text: 'OK', style: 'default' }],
  ): void => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = (): void => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const AlertComponent = (): React.JSX.Element => (
    <CustomAlert
      visible={alertConfig.visible}
      title={alertConfig.title}
      message={alertConfig.message}
      buttons={alertConfig.buttons}
      onDismiss={hideAlert}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 16,
    minWidth: Math.min(270, screenWidth - 140),
    maxWidth: screenWidth - 140,
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.9)',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 8,
    lineHeight: 22,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    color: '#111',
    paddingHorizontal: 20,
    paddingBottom: 20,
    lineHeight: 18,
  },
  buttonContainer: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.15)',
    backgroundColor: 'transparent',
  },
  horizontalButtonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  singleButton: {},
  leftButton: {
    flex: 1,
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
  },
  rightButton: {
    flex: 1,
  },
  buttonWithBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
  },
  buttonText: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '400',
  },
  defaultButtonText: {
    color: '#007AFF',
    fontWeight: '400',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: '400',
  },
  destructiveButtonText: {
    color: '#FF3B30',
    fontWeight: '400',
  },
});

export { CustomAlert, useCustomAlert };
