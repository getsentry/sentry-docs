function ExternalLink({
  width = 14,
  height = 14,
  ...props
}: React.SVGAttributes<SVGElement>) {
  return (
    <span className="icon icon-external-link">
      <svg
        viewBox="0 0 24 24"
        width={width}
        height={height}
        className="ml-1 inline"
        {...props}
      >
        <path
          fill="currentColor"
          d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
        />
      </svg>
    </span>
  );
}
export default ExternalLink;
