import * as React from 'react';
import { SVGProps } from 'react';

const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      fill='#45464E'
      d='m6.667 10.115 6.127-6.129.944.943L6.667 12 2.423 7.758l.942-.943 3.3 3.3Z'
    />
  </svg>
);
export { CheckIcon };
