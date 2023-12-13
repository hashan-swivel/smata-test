import { SVGProps } from 'react';

const HomeIcon = ({ width = 24, height = 24, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m12.62 3.223-.613-.473-.612.473L3.658 9.21l-.388.3v11.752h17.474V9.51l-.388-.3-7.737-5.987Zm-7.35 16.04V10.49l6.737-5.212 6.737 5.212v8.771H5.27Zm1.321-3.096v2h10.832v-2H6.591Z'
      clipRule='evenodd'
    />
  </svg>
);

export default HomeIcon;
