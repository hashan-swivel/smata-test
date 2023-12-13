import { SVGProps } from 'react';

const SettingsIcon = ({ width = 20, height = 20, ...otherProps }: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} fill='none' {...otherProps}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='M10.378 2.352 10 2.132l-.378.22-6 3.5-.372.217v7.861l.372.218 6 3.5.378.22.378-.22 6-3.5.372-.217V6.069l-.372-.217-6-3.5ZM4.75 13.07V6.931L10 3.868l5.25 3.063v6.138L10 16.132l-5.25-3.063ZM10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
      clipRule='evenodd'
    />
  </svg>
);
export default SettingsIcon;
