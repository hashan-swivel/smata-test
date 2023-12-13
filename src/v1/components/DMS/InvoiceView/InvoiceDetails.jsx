import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { autofill } from 'redux-form';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faLink } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tippy';
import { Fields } from '../../Form';
import { DatePicker, DollarInput } from '../../Form/Fields';
import { datetimeConstants, invoiceConstants } from '../../../../constants';
import { currencyFormat, gstCalculator, stripInput } from '../../../../utils';
import { modalActions } from '../../../../actions';

import Accordion from './Accordion';

import './InvoiceDetails.module.scss';

const tradeIdLabel = (creditorId, onLinkToJobClicked) => (
  <label style={{ fontWeight: 'bold' }}>
    Trade Id
    {creditorId ? (
      <span className='link-job-btn' onClick={onLinkToJobClicked}>
        {' '}
        <FontAwesomeIcon icon={faLink} size='sm' color='#4A90E2' />
      </span>
    ) : (
      <Tooltip
        arrow
        title='Please select creditor first'
        position='bottom'
        animation='fade'
        theme='light'
      >
        {' '}
        <FontAwesomeIcon icon={faLink} size='sm' />
      </Tooltip>
    )}
  </label>
);

const dueDateLabel = (showDueDateTooltip) => {
  return (
    <label style={{ fontWeight: 'bold' }}>
      Due Date
      {showDueDateTooltip && (
        <Tooltip
          arrow
          title='The invoice will export to Strata Master with this due date. Leave the date blank if you do not want to apply a due date for payment'
          position='bottom'
          animation='fade'
          theme='light'
        >
          {' '}
          <FontAwesomeIcon icon={faInfoCircle} size='sm' />
        </Tooltip>
      )}
    </label>
  );
};

const fields = (spNumbers, gstRegistered, creditorId, onLinkToJobClicked, showDueDateTooltip) => [
  {
    name: 'spNumber',
    label: 'Plan Number',
    component: 'input',
    classNames: 'invoice-sp',
    disabled: true
  },
  {
    name: 'invoiceDetails.invoiceNumber',
    label: 'Invoice Number',
    component: 'input',
    type: 'text',
    classNames: 'invoice-number',
    maxLength: invoiceConstants.INVOICE_NUMBER_MAXLENGTH,
    isNormalize: true
  },
  {
    name: 'invoiceDetails.poNumber',
    label: 'PO Number',
    component: 'input',
    type: 'text',
    classNames: 'invoice-po'
  },
  {
    name: 'invoiceDetails.invoiceAmount',
    label: 'Amount',
    component: 'input',
    type: 'number',
    classNames: 'invoice-amount'
  },
  {
    name: 'invoiceDetails.invoiceDate',
    label: 'Invoice Date',
    component: DatePicker,
    classNames: 'invoice-date'
  },
  {
    name: 'invoiceDetails.invoiceGst',
    label: 'GST',
    component: 'input',
    type: 'number',
    classNames: 'invoice-gst',
    disabled: !gstRegistered
  },
  {
    name: 'invoiceDetails.invoiceDueDate',
    label: dueDateLabel(showDueDateTooltip),
    placeholder: 'Due Date',
    component: DatePicker,
    classNames: 'invoice-due-date'
  },
  {
    name: 'invoiceDetails.jobTradeId',
    label: tradeIdLabel(creditorId, onLinkToJobClicked),
    placeholder: 'Associated Trade Id',
    component: 'input',
    type: 'text',
    classNames: 'job-trade-id',
    disabled: true
  }
];

export const InvoiceDetails = (props) => {
  const { editing, formName, values, spNumber, creditorId } = props;
  const spNumbers = useSelector((state) => state.spNumbers.orgSpNumbers);
  const formState = useSelector((state) => state.form[formName]);
  const { values: formValues } = formState || {};
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [gstRegistered, setGstRegistered] = useState(formValues?.creditor?.gstRegistered === true);
  const dispatch = useDispatch();

  useEffect(() => {
    const invoiceAmount = values?.invoiceAmount || 0;
    // Update GST when invoice amount or GST status is changed by the user
    if (
      editing &&
      (formState?.fields?.invoiceDetails?.invoiceAmount?.visited ||
        formState?.fields?.creditor?.touched)
    ) {
      const currentGstRegistered = formValues?.creditor?.gstRegistered === true;
      const calculatedGst = gstCalculator(
        invoiceAmount,
        currentGstRegistered,
        currentUser?.country
      );

      dispatch(autofill(formName, 'invoiceDetails.invoiceGst', calculatedGst));
      setGstRegistered(currentGstRegistered);
    }
  }, [editing, values?.invoiceAmount, formValues?.creditor?.gstRegistered]);

  useEffect(() => {
    if (currentUser?.feature_flags?.invoice_transaction_date) {
      if (editing && formState?.fields?.invoiceDetails?.invoiceDate?.visited) {
        dispatch(autofill(formName, 'invoiceDetails.invoiceTransactionDate', values?.invoiceDate));
      }
    }
  }, [editing, values?.invoiceDate]);

  return (
    <React.Fragment>
      <Accordion title='Invoice Details:'>
        <div className='document-view-block-content'>
          <InvoiceDetailsBody
            {...props}
            spNumbers={spNumbers}
            gstRegistered={gstRegistered}
            onLinkToJobClicked={() =>
              dispatch(
                modalActions.showModal('JOB_REFERENCE', { creditorId, spNumber, currentUser })
              )
            }
            currentUser={currentUser}
          />
        </div>
      </Accordion>
    </React.Fragment>
  );
};

const InvoiceDetailsBody = ({
  editing,
  values,
  syncErrors,
  submitFailed,
  spNumbers,
  gstRegistered,
  creditorId,
  spNumber,
  onLinkToJobClicked,
  currentUser
}) => {
  const showDueDateTooltip = currentUser?.isTenantManager;
  let invoiceFields = [];
  if (editing) {
    invoiceFields = fields(
      spNumbers,
      gstRegistered,
      creditorId,
      onLinkToJobClicked,
      showDueDateTooltip
    );
  } else {
    invoiceFields = fields(spNumbers, false, null, null, showDueDateTooltip);
  }

  if (currentUser?.feature_flags?.invoice_transaction_date) {
    invoiceFields.push({
      name: 'invoiceDetails.invoiceTransactionDate',
      label: 'Transaction Date',
      placeholder: 'Transaction Date',
      component: DatePicker,
      customOptions: { dateFormat: 'd/m/Y', maxDate: 'today' },
      classNames: 'invoice-transaction-date'
    });
  }

  if (editing) {
    return (
      <>
        <Fields
          containerClass='invoice-items-container'
          fields={invoiceFields}
          values={values}
          syncErrors={syncErrors}
          submitFailed={submitFailed}
        />
      </>
    );
  }

  const invoiceValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (value && typeof value === 'object') {
      return value[0] ? moment(value[0]).format(datetimeConstants.FORMAT.DEFAULT) : value.value;
    }
    if (typeof value === 'number') {
      return currencyFormat(value);
    }
    return value;
  };

  const invoiceValues = {};

  if (values) {
    Object.keys(values).forEach((key) => {
      invoiceValues[key] = invoiceValue(values[key]);
    });
  }

  return (
    <div className='invoice-grid'>
      {invoiceFields.map((field) => (
        <span className='invoice-field-info' key={field.name}>
          <span className='invoice-field-title'>{field.label}</span>
          {field.name === 'spNumber' ? (
            <span className='invoice-field-value'>{spNumber || 'N/A'}</span>
          ) : (
            <span className='invoice-field-value'>
              {invoiceValues[field.name.split('.').slice(-1)]}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};
