'use client';

import {ImageLightbox} from './imageLightbox';

interface DocImageClientProps
  extends Omit<
    React.HTMLProps<HTMLImageElement>,
    'ref' | 'placeholder' | 'src' | 'width' | 'height'
  > {
  height: number;
  imgPath: string;
  src: string;
  width: number;
}

export function DocImageClient({
  src,
  imgPath,
  width,
  height,
  alt,
  style,
  className,
  ...props
}: DocImageClientProps) {
  return (
    <ImageLightbox
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      imgPath={imgPath}
      style={style}
      className={className}
      {...props}
    />
  );
}
