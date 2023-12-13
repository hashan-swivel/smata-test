import React from 'react';
import './Footer.module.scss';

export const Footer = ({ classNames, currentUser }) => (
  <footer className={`${classNames} foooter`}>
    <div className='wrapper'>
      <div className='footer-sitemap'>
        <span className='footer-sitemap-legal'>
          <a
            href={`${currentUser?.baseUrl}/privacy_policy`}
            target='_blank'
            rel='noopener noreferrer'
          >
            Privacy Policy
          </a>
          &nbsp;-&nbsp;
          <a
            href={`${currentUser?.baseUrl}/terms_and_conditions`}
            target='_blank'
            rel='noopener noreferrer'
          >
            Terms & Conditions
          </a>
        </span>
      </div>
    </div>
  </footer>
);
