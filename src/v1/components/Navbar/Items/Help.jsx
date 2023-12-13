import React, { useState } from 'react';
import { Tooltip } from 'react-tippy';
import { axiosInstance } from '../../../../utils';
import { zendeskHelpConstants } from '../../../../constants';

const Help = () => {
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    if (!loading) {
      setLoading(true);

      await axiosInstance
        .post(zendeskHelpConstants.BASE_PATH)
        .then((res) => {
          setLoading(false);
          window.open(res.data?.zendesk_redirect_url, '_blank');
        })
        .catch(() => {
          setLoading(false);
          window.open(zendeskHelpConstants.ZENDESK_HOME_PAGE_URL, '_blank');
        });
    }
  };

  return (
    <div className='navbar-menu-item'>
      <a href='#' className='navbar-menu-item-link' onClick={handleOnClick}>
        <Tooltip arrow title='Help' position='bottom' animation='fade' theme='light'>
          <span className='icon icon-help-white header-help' />
        </Tooltip>
        <span className='icon-text'>Help</span>
      </a>
    </div>
  );
};

export default Help;
