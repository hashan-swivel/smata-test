import React from 'react';
import './CancelHoldInvoice.module.scss';

export const IsOnHold = () => (
  <div className='cancel-hold-invoice-container'>
    <h3 className='cancel-hold-invoice-title'>Invoice is on hold</h3>
    <p className='cancel-hold-invoice-text'>
      You cannot approve this invoice because it is on-hold. Once it is off-hold you will be able to
      approve.
    </p>
  </div>
);
