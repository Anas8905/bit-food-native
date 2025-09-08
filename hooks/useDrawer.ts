import { useDrawerStore } from '@/stores/drawer';

export const useDrawer = (): {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
} => {
  const isOpen = useDrawerStore((s) => s.isOpen);
  const openDrawer = useDrawerStore((s) => s.openDrawer);
  const closeDrawer = useDrawerStore((s) => s.closeDrawer);

  return { isOpen, openDrawer, closeDrawer };
};
