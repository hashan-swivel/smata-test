import { SVGProps } from 'react';

const TimeIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => {
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
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 2.87988H13V1.37988H7V2.87988ZM10 17.1299C13.3137 17.1299 16 14.4436 16 11.1299C16 7.81617 13.3137 5.12988 10 5.12988C6.68629 5.12988 4 7.81617 4 11.1299C4 14.4436 6.68629 17.1299 10 17.1299ZM10 18.6299C14.1421 18.6299 17.5 15.272 17.5 11.1299C17.5 9.45689 16.9522 7.91184 16.0262 6.6643L17.0303 5.66021L15.9697 4.59955L15.0156 5.55362C13.6869 4.3577 11.9284 3.62988 10 3.62988C5.85786 3.62988 2.5 6.98775 2.5 11.1299C2.5 15.272 5.85786 18.6299 10 18.6299ZM9.25 7.12988V12.1299H10.75V7.12988H9.25Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default TimeIcon;
