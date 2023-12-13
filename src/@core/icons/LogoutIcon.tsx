import { SVGProps } from 'react';

const LogoutIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='M7.5 6.087a5.25 5.25 0 1 1 0 7.827l-1 1.117a6.75 6.75 0 1 0 0-10.062l1 1.118ZM6.333 13v-2.333h5V9.333h-5V7L3 10l3.333 3Z'
      clipRule='evenodd'
    />
  </svg>
);
export default LogoutIcon;
