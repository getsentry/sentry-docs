type ArcadeProps = {
  src: string;
};
export function Arcade({src}: ArcadeProps) {
  return (
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
          colorScheme: 'light',
          height: '100%',
          left: '0px',
          position: 'absolute',
          top: '0px',
          width: '100%',
        }}
      />
    </div>
  );
}
