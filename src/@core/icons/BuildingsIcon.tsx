import { SVGProps } from 'react';

const BuildingsIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => {
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
        d='M5.97234 2.5H5.22234V3.25V6.94941L2.26835 9.42425L2 9.64908V9.99916V16.7483V17.4983H2.75H6.77793H10.8059H17.2505H18.0005V16.7483V3.25V2.5H17.2505H5.97234ZM3.5 10.3492L6.77793 7.603L10.0559 10.3492V15.9983H7.52793V12.5301H6.02793V15.9983H3.5V10.3492ZM11.5559 9.99916V15.9983H16.5005V4H6.72234V5.69272L6.77793 5.64615L7.25958 6.04968L11.2875 9.42425L11.5559 9.64908V9.99916ZM11.4508 7.37451H10.0002V5.87451H11.4508V7.37451ZM14.6731 7.37451H13.2226V5.87451H14.6731V7.37451ZM13.2226 10.7493H14.6731V9.24927H13.2226V10.7493ZM14.6731 14.1238H13.2226V12.6238H14.6731V14.1238Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default BuildingsIcon;
