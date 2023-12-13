import { SVGProps } from 'react';

const BillableIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => {
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
        fill='currentColor'
        fillRule='evenodd'
        d='M1.667 10a8.333 8.333 0 1 0 16.666 0 8.333 8.333 0 0 0-16.666 0Zm13.047 4.714a6.667 6.667 0 1 1-9.428-9.428 6.667 6.667 0 0 1 9.428 9.428ZM9.244 15v-.917H7.326v-1.5h1.916V10.75H7.66a.75.75 0 0 1-.75-.75V6.667a.75.75 0 0 1 .75-.75h1.583V5h1.5v.917h1.584v1.5h-1.584V9.25h1.584a.75.75 0 0 1 .75.75v3.333a.75.75 0 0 1-.75.75h-1.584V15h-1.5Zm2.333-2.417h-.834V10.75h.834v1.833ZM9.243 7.417V9.25H8.41V7.417h.833Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

export default BillableIcon;
