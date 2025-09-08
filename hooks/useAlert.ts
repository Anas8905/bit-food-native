import { useAlertStore } from '@/stores/alert';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export const useAlert = (): {
  showAlert: (title?: string, message?: string, buttons?: AlertButton[]) => void;
  hideAlert: () => void;
} => {
  const showAlert = useAlertStore((s) => s.show);
  const hideAlert = useAlertStore((s) => s.hide);
  return { showAlert, hideAlert };
};
