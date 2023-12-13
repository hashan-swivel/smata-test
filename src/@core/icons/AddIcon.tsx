import { SVGProps } from 'react';

const AddIcon = ({ width = 20, height = 20 }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    viewBox='0 0 20 20'
    fill='none'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M9.25 10.75V16H10.75V10.75H16V9.25H10.75V4H9.25V9.25H4V10.75H9.25Z'
      fill='currentColor'
    />
  </svg>
);

export default AddIcon;
