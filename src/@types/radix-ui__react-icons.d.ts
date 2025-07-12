declare module '@radix-ui/react-icons' {
  import * as React from 'react';

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    width?: number | string;
    height?: number | string;
  }

  export const CopyIcon: React.FC<IconProps>;
  export const CheckIcon: React.FC<IconProps>;
  export const ClipboardCopyIcon: React.FC<IconProps>;
  export const ClipboardCheckIcon: React.FC<IconProps>;
}