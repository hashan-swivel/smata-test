import React from 'react';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSortOptions } from '../../../actions/dms';

import './SortOptions.module.scss';

export const invoiceStatusExplanation = (
  <div>
    <table id='invoice-status-explanation-table'>
      <colgroup>
        <col style={{ width: '25%' }} />
        <col style={{ width: '75%' }} />
      </colgroup>
      <thead />
      <tbody>
        <tr>
          <td>
            <div className='invoice-status new'>NEW</div>
          </td>
          <td>
            Recently added and ready to be reviewed by the First Approver. Requires details to be
            added (mandatory details are Plan Number, Creditor, Invoice Amount, Invoice Number,
            Invoice Date, Row Items).
          </td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status under-review'>UNDER REVIEW</div>
          </td>
          <td>In the invoice approval process and is with an approver to action.</td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status on-hold'>ON HOLD</div>
          </td>
          <td>
            Internal approver has restricted the invoice from moving through the invoice approval
            process. Check the invoice history for comments/reasons from the user that made this
            action.
          </td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status cancelled'>CANCELLED</div>
          </td>
          <td>Removed from the invoice processing workflow. Can be re-opened.</td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status deleted'>DELETED</div>
          </td>
          <td>Deleted from the document management system. Cannot be re-opened.</td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status duplicate'>DUPLICATE</div>
          </td>
          <td>
            Invoice details match another invoice in the system (invoice number, invoice amounts,
            creditor business number).
          </td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status rejected'>REJECTED</div>
          </td>
          <td>
            Invoice has been rejected by an internal approver and sent back to the service provider
            to re-submit. You can check the invoice history for comments.
          </td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status processing'>PROCESSING</div>
          </td>
          <td>Approved for payment and is being processed to the accounting platform.</td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status processing-failed'>PROCESSING FAILED</div>
          </td>
          <td>Approved for payment and but failed to process to the accounting platform.</td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status approved'>APPROVED FOR PAYMENT</div>
          </td>
          <td>
            Approved by required approvers and transfered to accounting system ready for payment.
          </td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status scheduled-payment'>SCHEDULED FOR PAYMENT</div>
          </td>
          <td>
            Future date set for invoice to be transferred to accounting system for payment. Hover
            over calendar icon in the right-hand column for date.
          </td>
        </tr>
        <tr>
          <td>
            <div className='invoice-status paid'>PAID</div>
          </td>
          <td>Invoice has been paid.</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const SortOptions = ({ visible, viewType, allSelected, setAllSelected }) => {
  const dispatch = useDispatch();
  const { order, sort } = useSelector((state) => state.dms.sortOptions);

  if (!visible) return null;

  const changeSortOption = (event, option) => {
    event.preventDefault();
    if (order === option) {
      dispatch(setSortOptions(option, sort === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortOptions(option));
    }
  };

  const optionClassNames = 'dms-sort-option icon-after icon-chevron-down-dark';

  if (viewType === 'documents') {
    return (
      <div className='dms-sort-options document-view'>
        <div className='dms-sort-option checkboxes-field doc-select-all'>
          <div className='option'>
            <input
              id='selected-all'
              name='selected-all'
              onChange={(event) => setAllSelected(event)}
              checked={allSelected}
              type='checkbox'
            />
            <label htmlFor='selected-all' />
          </div>
        </div>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'sp_number')}
          className={`${optionClassNames} doc-sort-sp ${order === 'sp_number' ? 'active' : ''}`}
        >
          Plan Number
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'category')}
          className={`${optionClassNames} doc-sort-type ${order === 'category' ? 'active' : ''}`}
        >
          Type
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'filename')}
          className={`${optionClassNames} doc-sort-name ${order === 'filename' ? 'active' : ''}`}
        >
          Name
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'added_date')}
          className={`${optionClassNames} doc-sort-date ${order === 'added_date' ? 'active' : ''}`}
        >
          Added
        </a>
        <div className='dms-sort-option doc-actions-header' />
      </div>
    );
  }

  if (viewType === 'invoices') {
    return (
      <div className='dms-sort-options invoice-view'>
        <div className='dms-sort-option checkboxes-field invoice-select-all'>
          <div className='option'>
            <input
              id='selected-all'
              name='selected-all'
              onChange={(event) => setAllSelected(event)}
              checked={allSelected}
              type='checkbox'
            />
            <label htmlFor='selected-all' />
          </div>
        </div>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'sp_number')}
          className={`${optionClassNames} invoice-sp-number ${
            order === 'sp_number' ? 'active' : ''
          }`}
        >
          Plan Number
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'contractor.name')}
          className={`${optionClassNames} invoice-sort-contractor ${
            order === 'contractor.name' ? 'active' : ''
          }`}
        >
          Contractor
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'invoice.status')}
          className={`${optionClassNames} invoice-sort-status ${
            order === 'invoice.status' ? 'active' : ''
          }`}
        >
          <Tooltip
            arrow
            html={invoiceStatusExplanation}
            position='bottom'
            animation='fade'
            theme='light'
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tooltip>
          <span style={{ marginLeft: '5px' }}>Status</span>
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'invoice.invoice_number')}
          className={`${optionClassNames} invoice-sort-number ${
            order === 'invoice.invoice_number' ? 'active' : ''
          }`}
        >
          No.
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'invoice.invoiced_price')}
          className={`${optionClassNames} invoice-sort-amount ${
            order === 'invoice.invoiced_price' ? 'active' : ''
          }`}
        >
          Amount
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'added_date')}
          className={`${optionClassNames} invoice-sort-date ${
            order === 'added_date' ? 'active' : ''
          }`}
        >
          Added
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'currently_with_user_details.initials')}
          className={`${optionClassNames} invoice-sort-currently-with ${
            order === 'currently_with_user_details.initials' ? 'active' : ''
          }`}
        >
          <Tooltip
            arrow
            title="Invoice is in this user's tasks to review"
            position='bottom'
            animation='fade'
            theme='light'
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tooltip>
          <span style={{ marginLeft: '5px' }}>Action</span>
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'currently_with_user_details.time_with')}
          className={`${optionClassNames} sort-currently-time-with time-with-header ${
            order === 'currently_with_user_details.time_with' ? 'active' : ''
          }`}
        >
          <Tooltip
            arrow
            title='This is the amount of time the invoice has been with the current action user.'
            position='bottom'
            animation='fade'
            theme='light'
          >
            <FontAwesomeIcon icon={faInfoCircle} />
          </Tooltip>
          <span style={{ marginLeft: '5px' }}>TIME</span>
        </a>

        <a
          href='#sort'
          onClick={(event) => changeSortOption(event, 'invoice.payment_date')}
          className={`${optionClassNames} invoice-paid-date ${
            order === 'invoice.payment_date' ? 'active' : ''
          }`}
        >
          Date Paid
        </a>

        <div className='dms-sort-option invoice-actions-header' />
      </div>
    );
  }
};
