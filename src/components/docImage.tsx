import {serverContext} from 'sentry-docs/serverContext';

export default function DocImage({src, ...props}: React.HTMLProps<HTMLImageElement>) {
  const {path} = serverContext();
  if (!src?.startsWith('/') && !src?.includes('://')) {
    src = `/${path.join('/')}/${src}`;
  }
  return (
    <span style={{display: 'block', textAlign: 'center'}}>
      <a href={src} target="_blank" rel="noreferrer">
        <img src={src} {...props} />
      </a>
    </span>
  );
}
