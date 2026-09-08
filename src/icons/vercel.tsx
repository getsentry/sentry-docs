function Vercel({width = 16, height = 16, ...props}: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      fill="currentColor"
      height={height}
      viewBox="0 0 24 24"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Vercel</title>
      <path d="M24 22.525H0l12-21.05 12 21.05Z" />
    </svg>
  );
}
export default Vercel;
