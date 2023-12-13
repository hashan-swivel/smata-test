import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Banner.module.scss';

const Banner = ({ banner, onDismiss }) => {
  const { colour_background: backgroundColor, colour_text: color, content, dismissible } = banner;

  return (
    <div className='banner' style={{ backgroundColor, color }}>
      <div className='banner-content'>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {dismissible && (
          <button type='button' className='dismiss-button' onClick={() => onDismiss(banner.token)}>
            <FontAwesomeIcon icon={faTimes} color={color} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
