import * as React from 'react';
import { SVGProps } from 'react';

const ArrowUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <path stroke='#45464E' strokeWidth={1.5} d='M10 16V4m0 0-6 6m6-6 6 6' />
  </svg>
);
export default ArrowUpIcon;
