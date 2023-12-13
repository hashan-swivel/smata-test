import { SVGProps } from 'react';

const FlagIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path stroke='#444749' strokeWidth={1.5} d='M3.5 3H10l1 2h5.5v9h-5L10 12.5H3.5V3Zm0 0v15.5' />
  </svg>
);
export default FlagIcon;
