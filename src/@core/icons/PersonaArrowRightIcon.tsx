import * as React from 'react';
import { SVGProps } from 'react';

const PersonaArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='M6.848 2.2c-1.568 0-2.82 1.241-2.82 2.75S5.28 7.7 6.848 7.7c1.567 0 2.82-1.241 2.82-2.75S8.415 2.2 6.848 2.2Zm-3.82 2.75c0-2.081 1.72-3.75 3.82-3.75 2.1 0 3.82 1.669 3.82 3.75S8.948 8.7 6.848 8.7c-2.1 0-3.82-1.669-3.82-3.75Zm3.8 5.395a4.02 4.02 0 0 0-4.002 3.642l-.996-.094a5.02 5.02 0 0 1 4.998-4.548v1ZM10.83 8.8v2.333h-3v1.334h3V14.8l3.333-3-3.333-3Z'
      clipRule='evenodd'
    />
  </svg>
);
export { PersonaArrowRightIcon };
