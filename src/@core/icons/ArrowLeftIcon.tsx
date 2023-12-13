import { SVGProps } from 'react';

const ArrowLeftIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    viewBox='0 0 20 20'
    fill='none'
    {...otherProps}
  >
    <path d='M16 10H4M4 10L10 4M4 10L10 16' stroke='currentColor' strokeWidth='1.5' />
  </svg>
);

export default ArrowLeftIcon;
