import React from 'react';
import Image from 'next/image';
import notFoundImage from '../../../images/illustrations/no-files.svg';
import './NotFound.module.scss';

export const NotFound = ({ text = 'No documents found' }) => (
  <div className='dms-not-found'>
    <div className='dms-not-found-content'>
      <Image src={notFoundImage} alt={text} />
      <h2 className='h2'>{text}</h2>
    </div>
  </div>
);
