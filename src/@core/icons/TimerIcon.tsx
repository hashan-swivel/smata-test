import { SVGProps } from 'react';

const TimerIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='M7 2.88h6v-1.5H7v1.5Zm3 14.25a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 1.5a7.5 7.5 0 0 0 6.026-11.966L17.03 5.66 15.97 4.6l-.954.954A7.5 7.5 0 1 0 10 18.63Zm-.75-11.5v5h1.5v-5h-1.5Z'
      clipRule='evenodd'
    />
  </svg>
);
export default TimerIcon;
