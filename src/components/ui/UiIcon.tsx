import styled from 'styled-components';
import { lazy } from 'react';

// These icons should be arranged alphabetically for easy sorting

const icons = {
  ArrowCircleLeft: lazy(() =>
    import('./icons/arrow-circle-left.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  ArrowCircleRight: lazy(() =>
    import('./icons/arrow-circle-right.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  ArrowLeft: lazy(() =>
    import('./icons/arrow-left.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Card: lazy(() =>
    import('./icons/card.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Wallet: lazy(() =>
    import('./icons/wallet.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),

  CardPos: lazy(() =>
    import('./icons/card-pos.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CaretDown: lazy(() =>
    import('./icons/caret-down.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CaretDownBold: lazy(() =>
    import('./icons/caret-down-bold.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CaretUp: lazy(() =>
    import('./icons/caret-up.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CaretLeft: lazy(() =>
    import('./icons/caret-left.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CaretRight: lazy(() =>
    import('./icons/caret-right.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  ArrowRight: lazy(() =>
    import('./icons/arrow-right.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Buildings: lazy(() =>
    import('./icons/company.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CallReceived: lazy(() =>
    import('./icons/call-received.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Camera: lazy(() =>
    import('./icons/camera.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Car: lazy(() =>
    import('./icons/car.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Chat: lazy(() =>
    import('./icons/chat.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  ChartSquare: lazy(() =>
    import('./icons/chart-square.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Close: lazy(() =>
    import('./icons/close.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CloseThick: lazy(() =>
    import('./icons/close-thick.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Check: lazy(() =>
    import('./icons/check.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CheckCircle: lazy(() =>
    import('./icons/check-circle.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  CloseCircle: lazy(() =>
    import('./icons/close-circle.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  DocumentUpload: lazy(() =>
    import('./icons/document-upload.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  DoubleChat: lazy(() =>
    import('./icons/double-chat.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  DoubleTick: lazy(() =>
    import('./icons/double-tick.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  DuoTrucks: lazy(() =>
    import('./icons/duo-trucks.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Eye: lazy(() =>
    import('./icons/eye.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  EyeSlash: lazy(() =>
    import('./icons/eye-slash.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  HalfStar: lazy(() =>
    import('./icons/half-star.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  GoldStar: lazy(() =>
    import('./icons/gold-star.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Information: lazy(() =>
    import('./icons/information.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  InfoCircle: lazy(() =>
    import('./icons/info-circle.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  InfoCircleOutline: lazy(() =>
    import('./icons/info-circle-outline.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Jobs: lazy(() =>
    import('./icons/jobs.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Link: lazy(() =>
    import('./icons/link.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Location: lazy(() =>
    import('./icons/location.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  LocationTick: lazy(() =>
    import('./icons/location-tick.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Logout: lazy(() =>
    import('./icons/log-out.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  MagicStar: lazy(() =>
    import('./icons/magic-star.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Menu: lazy(() =>
    import('./icons/menu.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Moneys: lazy(() =>
    import('./icons/moneys.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Notification: lazy(() =>
    import('./icons/notification.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  PaperPlaneTilt: lazy(() =>
    import('./icons/paper-plane-tilt.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  PasswordCheck: lazy(() =>
    import('./icons/password-check.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),

  PlayCircle: lazy(() =>
    import('./icons/play-circle.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  ReceiptEdit: lazy(() =>
    import('./icons/receipt-edit.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Refresh: lazy(() =>
    import('./icons/refresh.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Search: lazy(() =>
    import('./icons/search.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),

  Settings: lazy(() =>
    import('./icons/settings.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Star: lazy(() =>
    import('./icons/star.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Security: lazy(() =>
    import('./icons/security.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Tick: lazy(() =>
    import('./icons/tick.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  TruckTick: lazy(() =>
    import('./icons/ticked-truck.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Trash: lazy(() =>
    import('./icons/trash.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Truck: lazy(() =>
    import('./icons/truck.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  TruckBold: lazy(() =>
    import('./icons/truck-bold.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  TruckRemove: lazy(() =>
    import('./icons/truck-remove.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  User: lazy(() =>
    import('./icons/user.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Users: lazy(() =>
    import('./icons/users.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  UserCircleAdd: lazy(() =>
    import('./icons/user-cirlce-add.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  UserOctagon: lazy(() =>
    import('./icons/user-octagon.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  UserSquare: lazy(() =>
    import('./icons/user-square.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  VerticalDots: lazy(() =>
    import('./icons/vertical-dots.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
  Warning: lazy(() =>
    import('./icons/warning.svg').then((module) => ({
      default: module.ReactComponent,
    })),
  ),
};

export type Icons = keyof typeof icons;
interface Props {
  /** Name of the icon as stored in the icons object */
  icon: Icons;
  size?: string;
}
export default function UiIcon({ icon, size = '16' }: Props) {
  const LazyLoadedIcon = icons[icon];
  return (
    <IconStyle size={size} className="icon">
      {LazyLoadedIcon && <LazyLoadedIcon />}
    </IconStyle>
  );
}

const IconStyle = styled.span`
  font-size: ${({ size }: { size?: Props['size'] }) =>
    pxToRem((size && parseInt(size)) || 16)};

  svg {
    width: ${({ size }: { size?: Props['size'] }) =>
      pxToRem((size && parseInt(size)) || 16)};
    height: ${({ size }: { size?: Props['size'] }) =>
      pxToRem((size && parseInt(size)) || 16)};
    fill: var(--color-gray-80);
  }
`;
