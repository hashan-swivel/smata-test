import * as React from 'react';
import { SVGProps } from 'react';

const AlertIcon16 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='M13.66 7.995a5.665 5.665 0 1 1-11.33 0 5.665 5.665 0 0 1 11.33 0Zm1 0a6.665 6.665 0 1 1-13.33 0 6.665 6.665 0 0 1 13.33 0ZM7.495 5.64v-1h1v1h-1Zm0 5.72V6.916h1v4.444h-1Z'
      clipRule='evenodd'
    />
  </svg>
);

const AlertIcon20 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='M4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm-1.5 0a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Zm8.25 2.5V14h-1.5v-1.5h1.5Zm0-6.5v5h-1.5V6h1.5Z'
      clipRule='evenodd'
    />
  </svg>
);

export { AlertIcon20, AlertIcon16 };
