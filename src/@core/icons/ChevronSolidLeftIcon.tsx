import { SVGProps } from 'react';

const ChevronSolidLeftIcon = ({
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
    <path d='M12 6L8 10L12 14V6Z' fill='currentColor' />
  </svg>
);

export default ChevronSolidLeftIcon;
