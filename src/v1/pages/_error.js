import React from 'react';
import NextLink from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Layout } from '@/components/v1';
import { errorConstants } from '@/constants';

import './_error.module.scss';

export default function Error({ statusCode }) {
  const errorObj = errorConstants[statusCode?.toString()] || errorConstants['500'];

  return (
    <div className='error-content'>
      <div className='error-code'>{statusCode}</div>
      <div className='error-message-primary'>{errorObj.title}</div>
      <div className='error-message-secondary'>{errorObj.message}</div>
      <div className='action-buttons'>
        <NextLink href='/' className='button button--primary'>
          <FontAwesomeIcon icon={faHome} />
          GO TO HOMEPAGE
        </NextLink>

        <NextLink
          href='/'
          target='_blank'
          rel='noopener noreferrer'
          className='button button--line-primary'
        >
          <FontAwesomeIcon icon={faEnvelope} />
          CONTACT SUPPORT
        </NextLink>
      </div>
    </div>
  );
}

Error.getLayout = (page) => <Layout headerClassName='mw-100'>{page}</Layout>;
