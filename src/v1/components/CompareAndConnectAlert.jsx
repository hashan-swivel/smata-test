import React, { useEffect, useState } from 'react';
import { faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import './CompareAndConnectAlert.module.scss';

const CompareAndConnectAlert = ({ user, headerClassName }) => {
  const headerClassNames = classNames(`${user ? 'user-wrapper' : 'wrapper'}`, headerClassName);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('smata.compare_and_connect_dismissed') === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    window.localStorage.setItem('smata.compare_and_connect_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className='compare-connect-alert'>
      <div className={headerClassNames}>
        <div className='compare-connect-alert-container'>
          <span>
            <FontAwesomeIcon icon={faInfoCircle} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a target='_blank' href='/src/pages/v1/connections' rel='noopener noreferrer'>
              We have partnered with Compare & Connect to help you save on your home bills. Find out
              how we can help by visiting our{' '}
              <span style={{ textDecoration: 'underline' }}>online comparison form.</span>
            </a>
          </span>

          <button
            type='button'
            className='button button--link-dark'
            style={{ padding: 0, margin: '0 15px' }}
            onClick={handleDismiss}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareAndConnectAlert;
