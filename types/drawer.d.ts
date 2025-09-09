type DrawerSide = 'left' | 'right';

type DrawerState = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

type DrawerBaseContext = {
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

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
