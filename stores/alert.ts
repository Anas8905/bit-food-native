import { create } from 'zustand';

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
