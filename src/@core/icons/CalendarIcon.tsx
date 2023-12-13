import { SVGProps } from 'react';

const SvgComponent = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='M5.875 6.125V4.781H3.156v3.407h13.688V4.78H14.03v1.344h-1.5V4.781H7.375v1.344h-1.5ZM3.156 16.594V9.687h13.688v6.907H3.156ZM17.594 3.28H14.03V1.906h-1.5v1.375H7.375V1.906h-1.5v1.375H1.656v14.813H18.344V3.28h-.75ZM9.156 11.5H5v3.344h4.156V11.5Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SvgComponent;
