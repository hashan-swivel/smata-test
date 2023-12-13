import * as React from 'react';
import { SVGProps } from 'react';

const MoreVertIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <path
      fill='#444749'
      d='M8.5 3.6a.1.1 0 0 1 .1-.1h2.8a.1.1 0 0 1 .1.1v2.8a.1.1 0 0 1-.1.1H8.6a.1.1 0 0 1-.1-.1V3.6ZM8.5 8.6a.1.1 0 0 1 .1-.1h2.8a.1.1 0 0 1 .1.1v2.8a.1.1 0 0 1-.1.1H8.6a.1.1 0 0 1-.1-.1V8.6ZM8.6 13.5a.1.1 0 0 0-.1.1v2.8a.1.1 0 0 0 .1.1h2.8a.1.1 0 0 0 .1-.1v-2.8a.1.1 0 0 0-.1-.1H8.6Z'
    />
  </svg>
);
export default MoreVertIcon;
