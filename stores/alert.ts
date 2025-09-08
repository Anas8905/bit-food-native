import { create } from 'zustand';
import type { AlertButton } from '@/components/CustomAlert';

type AlertState = {
  visible: boolean;
  title?: string | undefined;
  message?: string | undefined;
  buttons: AlertButton[];

  show: (title?: string, message?: string, buttons?: AlertButton[]) => void;
  hide: () => void;
};

export const useAlertStore = create<AlertState>()((set) => ({
  visible: false,
  buttons: [],
  show: (
    title?: string,
    message?: string,
    buttons: AlertButton[] = [{ text: 'OK', style: 'default' }]
  ) =>
    set({
      visible: true,
      title,
      message,
      buttons,
    }),
  hide: () => set({ visible: false, title: undefined, message: undefined, buttons: [] })
}));
