import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Layout } from '@/components/v1';
import { modalActions } from '@/actions';
import { compareConnectConstants } from '@/constants';

import './connections.module.scss';

const CompareAndConnect = ({ currentUser, dispatch }) => {
  const [submitted, setSubmitted] = useState(false);
  const [dismissAlert, setDismissAlert] = useState(false);

  if (!currentUser?.compare_connect?.url) return null;

  return (
    <div className='h-100' id='compare-and-connect-container'>
      {submitted ? (
        <div>
          <h2 style={{ textAlign: 'center', margin: '0 1rem' }}>
            Thanks for submitting your contact information. One of our connection experts will
            contact you within 5 minutes.
          </h2>
        </div>
      ) : (
        <div className='compare-connect-step-container mw-100'>
          <div className='left-banner-wrapper'>
            <div className='left-banner'>
              <img src='/cnc_left.png' alt='' />
            </div>
          </div>
          <div className='compare-and-connect-iframe-wrapper'>
            <h2 style={{ margin: '1rem', textAlign: 'center' }}>
              Find cheaper gas, electricity and broadband prices for your place.
            </h2>
            <iframe
              src={currentUser?.compare_connect?.url}
              className='compare-and-connect-iframe'
              frameBorder='0'
              width='100%'
              height='100%'
              title='compare-connect-iframe'
            />
            {!dismissAlert && (
              <div className='compare-connect-alert-container-bottom'>
                <span>
                  <FontAwesomeIcon icon={faInfoCircle} />{' '}
                  <a
                    href='#'
                    rel='noopener noreferrer'
                    onClick={() =>
                      dispatch(
                        modalActions.showModal('COMPARE_CONNECT_CALLBACK', {
                          setSubmitted
                        })
                      )
                    }
                  >
                    Prefer a phone call from one of our connection experts?{' '}
                    <span style={{ textDecoration: 'underline' }}>Request a call back</span>
                  </a>
                </span>

                <button
                  type='button'
                  className='button button--link-dark'
                  style={{ padding: 0, marginLeft: '10px' }}
                  onClick={() => setDismissAlert(true)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
          </div>
          <div className='right-banner-wrapper'>
            <div className='right-banner'>
              <img src='/cnc_right.png' alt='' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CompareAndConnect.getLayout = (page) => (
  <Layout
    customSeo={compareConnectConstants.SEO}
    headerClassName='mw-100'
    mainClassName='h-100'
    containerClassName='h-100 w-100'
    compareConnectAlert={false}
    isConnectionPage
  >
    {page}
  </Layout>
);

export default connect((state) => state.auth)(CompareAndConnect);
