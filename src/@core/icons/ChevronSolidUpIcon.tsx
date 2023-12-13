import { SVGProps } from 'react';

const ChevronSolidUpIcon = ({
  width = 20,
  height = 20,
  ...otherProps
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    viewBox='0 0 20 20'
    fill='none'
    {...otherProps}
  >
    <path d='M14 12L10 8L6 12H14Z' fill='currentColor' />
  </svg>
);

export default ChevronSolidUpIcon;
