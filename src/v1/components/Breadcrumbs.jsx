import React from 'react';
import { Link } from './Link';
import './Breadcrumbs.module.scss';

export const Breadcrumbs = ({ breadcrumbs }) => {
  if (!breadcrumbs || breadcrumbs.length < 1) return null;
  return (
    <div className='breadcrumbs'>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.label}>
          {index !== 0 && <>&nbsp;&#47;&nbsp;</>}
          <Breadcrumb key={breadcrumb.label} {...breadcrumb} />
        </div>
      ))}
    </div>
  );
};

const Breadcrumb = ({ href, label, query }) => {
  const truncatedLabel = label.length > 30 ? label.slice(0, 30 - 1) : null;

  if (href) {
    return (
      <Link className='breadcrumb' href={href} query={query}>
        <span title={label}>{truncatedLabel ? <>{truncatedLabel}&hellip;</> : label}</span>
      </Link>
    );
  }

  return (
    <span title={label} className='breadcrumb'>
      {truncatedLabel ? <>{truncatedLabel}&hellip;</> : label}
    </span>
  );
};
