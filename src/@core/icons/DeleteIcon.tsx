import * as React from 'react';
import { SVGProps } from 'react';

const DeleteIcon20 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M6.713 2.07a.75.75 0 0 0-.75.75v2.532H2.2v1.5h1.506v10.327c0 .414.336.75.75.75h10.872a.75.75 0 0 0 .75-.75V6.852h1.712v-1.5h-3.763V2.82a.75.75 0 0 0-.75-.75H6.713Zm5.814 3.282H7.463V3.57h5.064v1.782Zm-7.32 11.077V6.852h9.371v9.577H5.206Zm2.206-6.104 1.521 1.52-1.52 1.522 1.06 1.06 1.52-1.52 1.522 1.52 1.06-1.06-1.52-1.521 1.52-1.521-1.06-1.061-1.521 1.521-1.521-1.521-1.06 1.06Z'
      clipRule='evenodd'
    />
  </svg>
);

const DeleteIcon16 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='M5.327 1.665a.5.5 0 0 0-.5.5v2.167H1.66v1h1.333v8.5a.5.5 0 0 0 .5.5h8.834a.5.5 0 0 0 .5-.5v-8.5h1.5v-1H11.16V2.165a.5.5 0 0 0-.5-.5H5.327Zm4.833 2.667H5.827V2.665h4.333v1.667Zm-6.167 9v-8h7.834v8H3.993Zm6.02-5.147L8.702 9.498l1.313 1.313-.707.708-1.314-1.314L6.68 11.52l-.707-.708 1.313-1.313-1.313-1.313.707-.707 1.313 1.313 1.314-1.313.707.707Z'
      clipRule='evenodd'
    />
  </svg>
);

export { DeleteIcon20, DeleteIcon16 };
