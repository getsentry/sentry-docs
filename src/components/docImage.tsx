import {serverContext} from 'sentry-docs/serverContext';

export default function DocImage({src, ...props}: React.HTMLProps<HTMLImageElement>) {
  const {path} = serverContext();
  if (!src?.startsWith('/') && !src?.includes('://')) {
    src = `/${path.join('/')}/${src}`;
  }
  return (
    <a href={src} target="_blank" rel="noreferrer">
      <img src={src} {...props} />
    </a>
  );
}
