function Jira({width = 16, height = 16, ...props}: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      height={height}
      viewBox="0 0 128 128"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Jira</title>
      <path
        d="M108.02 61.99 65.01 18.98 61.99 15.96 20.02 57.93 15.96 61.99a3.54 3.54 0 0 0 0 5.02l41.97 41.97 4.06 4.06 41.97-41.97 4.06-4.06 4.02-4.02a3.54 3.54 0 0 0 0-5ZM61.99 80.96 47.02 65.99l14.97-14.97 14.97 14.97-14.97 14.97Z"
        fill="#2684FF"
      />
    </svg>
  );
}
export default Jira;
