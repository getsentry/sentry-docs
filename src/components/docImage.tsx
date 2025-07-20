import Image from 'next/image';

export default function DocImage({
  src,
  ...props
}: Omit<React.HTMLProps<HTMLImageElement>, 'ref' | 'placeholder'>) {
  if (!src) {
    return null;
  }

  // Remote images: render as <img>
  if (src.startsWith('http')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} {...props} />;
  }

  // Parse width/height from hash (set by remark-image-size.js)
  const srcURL = new URL(src, 'https://example.com');
  const imgPath = srcURL.pathname;
  const [width, height] = srcURL.hash // #wxh
    .slice(1)
    .split('x')
    .map(s => parseInt(s, 10));

  return (
    <a href={imgPath} target="_blank" rel="noreferrer">
      <Image
        {...props}
        src={src}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: 'auto',
        }}
        alt={props.alt ?? ''}
      />
    </a>
  );
}
