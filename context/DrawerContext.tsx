import { createContext, useState } from 'react';

export const DrawerContext = createContext({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};
