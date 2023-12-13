import { SVGProps } from 'react';

const DocumentIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
      {...otherProps}
    >
      <path
        d='M3.4375 7.5V17.2917H16.5625V2.5H8.32031M3.4375 7.5L8.32031 2.5M3.4375 7.5H8.32031V2.5'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  );
};

export default DocumentIcon;
