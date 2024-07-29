import {SVGAttributes} from 'react';

const rotation = {
  down: 0,
  right: 270,
} as const;

export function NavChevron({
  direction,
  ...props
}: SVGAttributes<SVGElement> & {
  direction: 'down' | 'right';
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
      style={{
        transition: 'transform 200ms',
        transform: `rotate(${rotation[direction]}deg)`,
      }}
    >
      <path
        fill="currentColor"
        d="M12.53 5.47a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06L8 8.94l3.47-3.47a.75.75 0 0 1 1.06 0Z"
      />
    </svg>
  );
}
