import { SVGProps } from 'react';

const CrossIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    viewBox='0 0 20 20'
    fill='none'
    {...otherProps}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M10.0017 11.0624L14.766 15.8267L15.8267 14.766L11.0624 10.0017L15.8267 5.23744L14.766 4.17678L10.0017 8.94106L5.23744 4.17678L4.17678 5.23744L8.94106 10.0017L4.17678 14.766L5.23744 15.8267L10.0017 11.0624Z'
      fill='currentColor'
    />
  </svg>
);

export default CrossIcon;
