declare module 'react-feather' {
  import {FC, SVGAttributes} from 'react';

  export interface FeatherIconProps extends SVGAttributes<SVGElement> {
    size?: number | string;
  }

  // We declare commonly used icons; others can be added as needed
  export const Check: FC<FeatherIconProps>;
  export const Clipboard: FC<FeatherIconProps>;
  export const ArrowDown: FC<FeatherIconProps>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons: Record<string, FC<FeatherIconProps>>;
  export default icons;
}
