import * as React from 'react';
import { SVGProps } from 'react';

const SuccessPoll = ({ width = 24, height = 24, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path
      fill='#10BF8B'
      d='M8.2 5a.2.2 0 0 0-.2.2v5.6c0 .11.09.2.2.2h13.6a.2.2 0 0 0 .2-.2V5.2a.2.2 0 0 0-.2-.2H8.2ZM4 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2 16a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM8.2 13a.2.2 0 0 0-.2.2v5.6c0 .11.09.2.2.2h9.6a.2.2 0 0 0 .2-.2v-5.6a.2.2 0 0 0-.2-.2H8.2Z'
    />
  </svg>
);
export default SuccessPoll;
