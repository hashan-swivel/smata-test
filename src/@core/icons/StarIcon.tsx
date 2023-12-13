import * as React from 'react';
import { SVGProps } from 'react';

const StarIcon16 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      fill='#45464E'
      fillRule='evenodd'
      d='m7.995 10.99 2.82 1.579-.63-3.17 2.374-2.196-3.21-.38-1.354-2.936L6.64 6.823l-3.21.38 2.373 2.195-.63 3.17 2.82-1.578ZM3.77 14.5l.943-4.748L1.16 6.466l4.807-.57L7.995 1.5l2.028 4.396 4.807.57-3.555 3.286.944 4.748-4.224-2.364L3.77 14.5Z'
      clipRule='evenodd'
    />
  </svg>
);

const StarIcon20 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <path
      fill='currentColor'
      fillRule='evenodd'
      d='m9.998 13.69 3.418 1.913-.763-3.843L15.53 9.1l-3.89-.461L9.997 5.08 8.357 8.639l-3.89.461 2.876 2.66-.764 3.843 3.419-1.914ZM4.474 18.5l1.234-6.209L1.06 7.994l6.286-.746L9.998 1.5l2.652 5.748 6.286.746-4.648 4.297L15.52 18.5l-5.523-3.092L4.474 18.5Z'
      clipRule='evenodd'
    />
  </svg>
);
export { StarIcon16, StarIcon20 };
