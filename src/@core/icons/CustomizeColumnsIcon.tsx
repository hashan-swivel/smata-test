import { SvgIcon } from '@mui/material';

const CustomizeColumnsIcon = () => (
  <SvgIcon>
    <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
      <g clipPath='url(#a)'>
        <path stroke='#45464E' strokeWidth={1.5} d='M3 9h12V4H7.5M3 9V4h4.5M3 9v7h4.5V4' />
        <path
          fill='#45464E'
          fillRule='evenodd'
          d='m15.97 11.714 1.969 3.447-2 3.464-3.97.017L10 15.196l2-3.464 3.97-.018Zm-2.586 4.68a1.244 1.244 0 1 0 1.244-2.155 1.244 1.244 0 0 0-1.244 2.155Z'
          clipRule='evenodd'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h20v20H0z' />
        </clipPath>
      </defs>
    </svg>
  </SvgIcon>
);
export default CustomizeColumnsIcon;
