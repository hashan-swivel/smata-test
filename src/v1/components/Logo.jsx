import React from 'react';
import './Logo.module.scss';

export const Logo = ({ light, image, href }) => {
  const classNames = image ? 'logo' : `logo ${light ? 'light' : 'dark'}`;

  return (
    <a className={classNames} href={href} target='_self'>
      {image && <img src={image} alt='Logo' />}
    </a>
  );
};

Logo.defaultProps = {
  light: false,
  href: '/documents'
};
