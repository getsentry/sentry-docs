import type {SVGAttributes} from 'react';
import {forwardRef} from 'react';

const iconSizes = {
  xs: 16,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 32,
} as const;

export interface SVGIconProps extends SVGAttributes<SVGSVGElement> {
  className?: string;
  color?: string | 'currentColor';
  size?: keyof typeof iconSizes;
}

export const SvgIcon = forwardRef<SVGSVGElement, SVGIconProps>(function SVGIcon(
  props: SVGIconProps,
  ref
) {
  const color = props.color ?? 'currentColor';
  const providedSize = props.size ?? 'sm';
  const size = iconSizes[providedSize];
  const viewBox = `0 0 ${size} ${size}`;

  return (
    <svg
      {...props}
      viewBox={viewBox}
      fill={color}
      height={`${size}px`}
      width={`${size}px`}
      ref={ref}
    />
  );
});
