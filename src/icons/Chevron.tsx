import styled from '@emotion/styled';

const rotation = {
  down: 0,
  right: -90,
} as const;

interface ChevronProps extends React.SVGAttributes<SVGElement> {
  direction: keyof typeof rotation;
}

const Chevron = styled(
  ({direction: _, width = 16, height = 16, ...props}: ChevronProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.53 5.47a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06L8 8.94l3.47-3.47a.75.75 0 0 1 1.06 0Z"
      />
    </svg>
  )
)`
  transition: transform 200ms;
  transform: rotate(${p => rotation[p.direction]}deg);
`;
export default Chevron;
