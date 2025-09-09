interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

type AlertState = {
  visible: boolean;
  title?: string | undefined;
  message?: string | undefined;
  buttons: AlertButton[];

  show: (title?: string, message?: string, buttons?: AlertButton[]) => void;
  hide: () => void;
};

interface CustomAlertProps {
  visible: boolean;
  title?: string | undefined;
  message?: string | undefined;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  type?: 'default' | 'destructive';
}

interface AlertConfig {
  visible: boolean;
  title?: string | undefined;
  message?: string | undefined;
  buttons: AlertButton[];
}

interface UseCustomAlertReturn {
  showAlert: (title?: string, message?: string, buttons?: AlertButton[]) => void;
  hideAlert: () => void;
  AlertComponent: () => React.JSX.Element;
}