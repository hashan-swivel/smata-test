import React from 'react';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepForward } from '@fortawesome/free-solid-svg-icons';
import './OtherInvoices.module.scss';

export const OtherInvoices = ({ invoices, nextInvoice }) =>
  nextInvoice ? (
    <div className='action-view-block'>
      <span className='icon icon-info-dark'>You have {invoices} invoices requiring action</span>
      <button
        type='button'
        className='button secondary next-button'
        onClick={() => {
          Router.push(`/invoice?id=${nextInvoice}`);
        }}
      >
        Next&nbsp;
        <FontAwesomeIcon icon={faStepForward} size='sm' />
      </button>
    </div>
  ) : null;
