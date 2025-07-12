declare module '@radix-ui/react-icons' {
  import type {ForwardRefExoticComponent, SVGProps} from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    height?: number | string;
    width?: number | string;
  }

  type IconComponent = ForwardRefExoticComponent<IconProps>;

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