declare module '@radix-ui/react-icons' {
  import * as React from 'react';

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    width?: number | string;
    height?: number | string;
  }

  type IconComponent = React.ForwardRefExoticComponent<IconProps>;

  export const CopyIcon: IconComponent;
  export const CheckIcon: IconComponent;
  export const ClipboardCopyIcon: IconComponent;
  export const ClipboardCheckIcon: IconComponent;
  export const CheckCircledIcon: IconComponent;
  export const ExclamationTriangleIcon: IconComponent;
  export const InfoCircledIcon: IconComponent;
  export const ChevronDownIcon: IconComponent;
  export const ChevronRightIcon: IconComponent;
  export const HamburgerMenuIcon: IconComponent;
  export const TriangleRightIcon: IconComponent;
  export const QuestionMarkCircledIcon: IconComponent;
  export const DoubleArrowLeftIcon: IconComponent;
  export const DoubleArrowRightIcon: IconComponent;
  export const CaretRightIcon: IconComponent;
  export const CaretSortIcon: IconComponent;
  export const MagnifyingGlassIcon: IconComponent;
  export const ArrowRightIcon: IconComponent;
  export const MoonIcon: IconComponent;
  export const SunIcon: IconComponent;
}