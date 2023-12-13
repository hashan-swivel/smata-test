import { SVGProps } from 'react';

const ChevronSolidRightIcon = ({
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
    <path d='M8 14L12 10L8 6L8 14Z' fill='currentColor' />
  </svg>
);

export default ChevronSolidRightIcon;
