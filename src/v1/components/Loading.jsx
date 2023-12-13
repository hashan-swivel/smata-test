import React from 'react';
import './Loading.module.scss';

export const Loading = ({ fill = '#333333', componentLoad, text = '' }) => (
  <div className={componentLoad ? 'component-loading' : 'loading'}>
    <svg
      className='spinner'
      version='1.1'
      id='L9'
      x='0px'
      y='0px'
      viewBox='0 0 100 100'
      enableBackground='new 0 0 0 0'
    >
      <path
        fill={fill}
        d='M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50'
      >
        <animateTransform
          attributeName='transform'
          attributeType='XML'
          type='rotate'
          dur='1s'
          from='0 50 50'
          to='360 50 50'
          repeatCount='indefinite'
        />
      </path>
    </svg>
    {text.length !== 0 && text}
  </div>
);
