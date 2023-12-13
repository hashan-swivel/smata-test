import React from 'react';
import NextLink from 'next/link';
import queryString from 'query-string';

export const Link = (props) => {
  const { children, classNameProp, href, image, title, target, onClick, query } = props;
  const isExternal = (href && href.indexOf('http') !== -1) || (href && href[0] === '#');

  if (isExternal) {
    return (
      <a
        href={href}
        className={classNameProp || ''}
        title={title || null}
        target={target || '_blank'}
        onClick={onClick}
        rel='nofollow noopener noreferrer'
        style={{ backgroundImage: image ? `url('${image}')` : '' }}
      >
        {children}
      </a>
    );
  }

  const hrefProp = { pathname: href, query };
  const queries = queryString.stringify(query);

  return (
    (<NextLink
      href={hrefProp}
      className={classNameProp || ''}
      title={title || null}
      onClick={onClick}
      target={target}
      style={{ backgroundImage: image ? `url('${image}')` : '' }}>

      {children}

    </NextLink>)
  );
};
