import { SVGProps } from 'react';

const TaskIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => {
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
        d='M6.79688 1.71094H6.04688V2.46094V5.77344H2.5H1.75V6.52344V17.5391V18.2891H2.5H13.5156H14.2656V17.5391V13.9922H17.5H18.25V13.2422V2.46094V1.71094H17.5H6.79688ZM13.5156 5.77344H7.54688V3.21094H16.75V12.4922H14.2656V6.52344V5.77344H13.5156ZM3.25 16.7891V7.27344H6.79688H12.7656V13.2422V16.7891H3.25ZM7.77642 14.417L11.8389 10.3545L10.7783 9.29389L7.24609 12.8261L5.33502 10.915L4.27436 11.9756L6.71576 14.417L7.24609 14.9474L7.77642 14.417Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default TaskIcon;
