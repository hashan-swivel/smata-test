import { SVGProps } from 'react';

const ChevronSolidDownIcon = ({
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
    <path d='M6 8L10 12L14 8H6Z' fill='currentColor' />
  </svg>
);

export default ChevronSolidDownIcon;
