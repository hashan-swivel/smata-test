import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postAlert } from '../../../actions/alerts';
import './InvoiceAction.module.scss';

export const InvoiceAction = (props) => {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(true);

  const sendAlertMessage = (status) => {
    const theMessage = `You have successfully ${status} this invoice`;
    dispatch(postAlert(theMessage, 'success'));
    setIsActive(false);
  };
  return (
    <div className={`invoice-action-container ${isActive ? 'active' : 'inactive'}`}>
      <span className='invoice-action-text icon icon-info-white'>This invoice requires action</span>
      <div className='invoice-action-button-container'>
        <button
          type='button'
          className='button invoice-action-button reject-button'
          onClick={() => sendAlertMessage('rejected')}
        >
          Reject
        </button>
        <button
          type='button'
          className='button invoice-action-button approve-button'
          onClick={() => sendAlertMessage('approved')}
        >
          Approve
        </button>
      </div>
    </div>
  );
};
