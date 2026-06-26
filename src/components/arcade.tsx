type ArcadeProps = {
  src: string;
  /** Constrains the embed width (for example `640px` or `55%`). Defaults to full width of the content column. */
  width?: string;
};

export function Arcade({src, width}: ArcadeProps) {
  return (
    <div
      style={{
        maxWidth: '100%',
        width: width ?? '100%',
      }}
    >
      {/* Inner wrapper: % padding is relative to outer width so aspect ratio matches narrow embeds. */}
      <div
        style={{
          height: '0px',
          paddingBottom: 'calc(56.8359% + 41px)',
          position: 'relative',
          width: '100%',
        }}
      >
        <iframe
          src={src}
          loading="lazy"
          allowFullScreen
          allow="fullscreen;"
          style={{
            border: 'none',
            colorScheme: 'light',
            height: '100%',
            left: '0px',
            position: 'absolute',
            top: '0px',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}
