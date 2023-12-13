import React from 'react';
import { Link } from './Link';

export const Button = (props) => {
  const { href, title, children, theme = 'primary', outline } = props;
  return (
    <Link
      href={href}
      title={title || ''}
      classNameProp={`button ${theme} ${outline ? 'outline' : ''}`}
    >
      {children}
    </Link>
  );
};
