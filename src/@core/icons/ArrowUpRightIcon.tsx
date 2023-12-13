import { SVGProps } from 'react';

const ArrowUpRightIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path stroke='#191C1E' strokeWidth={1.5} d='m5.5 14.5 9-9m0 0v9m0-9h-9' />
  </svg>
);
export default ArrowUpRightIcon;
