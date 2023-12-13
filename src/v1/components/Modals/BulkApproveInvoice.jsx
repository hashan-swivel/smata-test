import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import {
  faCheckCircle,
  faExclamationCircle,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import queryString from 'query-string';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import ModalContainer from './ModalContainer';
import { flashActions, modalActions } from '../../../actions';
import { axiosInstance, userOptionObj, chunk } from '../../../utils';
import { datetimeConstants } from '../../../constants';
import { Avatar } from '../Avatar';

import './BulkApproveInvoice.module.scss';

const BulkApproveInvoice = ({ selectedItems, setReload }) => {
  const currentUser = useSelector((state) => state?.auth?.currentUser);

  const dispatch = useDispatch();

  const [invoiceItems, setInvoiceItems] = useState(selectedItems);
  const [submitting, setSubmitting] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [hasDuplicateInvoices, setHasDuplicateInvoices] = useState(false);
  const spNumbersSelected = selectedItems
    ? [...new Set(selectedItems.map((i) => i.sp_number).filter((i) => i))]
    : [];
  const [insufficientFund, setInsufficientFund] = useState([]);

  useEffect(() => {
    if (spNumbersSelected.length) {
      checkBalance();
    }
  }, []);

  useEffect(() => {
    if (invoiceItems) {
      setHasDuplicateInvoices(invoiceItems.some((item) => item?.invoice.is_duplicated));
    }
  }, [invoiceItems]);

  async function checkBalance() {
    setSubmitting(true);
    setAlertMessage('Balance Checking...');

    const queryStr = queryString.stringify(
      { site_plan_ids: spNumbersSelected },
      { arrayFormat: 'bracket' }
    );
    await axiosInstance
      .get(`/v1/building_profile/site_plans?${queryStr}`)
      .then((res) => {
        const tmpInsufficientFund = [];
        spNumbersSelected.forEach((spNumber) => {
          const sumInvoicePrice = selectedItems
            .filter((x) => x.sp_number === spNumber)
            .reduce((s, i) => s + i?.invoice?.invoiced_price, 0);

          const plan = res.data.find((i) => i.name === spNumber);
          const availableBalance =
            parseFloat(plan?.available_balance) - parseFloat(plan?.funds_reserve);

          if (
            (parseFloat(sumInvoicePrice) >= 0 &&
              availableBalance >= 0 &&
              sumInvoicePrice > availableBalance) ||
            availableBalance < 0
          ) {
            tmpInsufficientFund.push(spNumber);
          }
        });
        setSubmitting(false);

        if (tmpInsufficientFund.length) {
          setInsufficientFund(tmpInsufficientFund);
          setAlertMessage(
            `Insufficient balance for the following Plan Number(s): ${tmpInsufficientFund.join(
              ', '
            )}`
          );
        } else {
          setAlertMessage('');
        }
      })
      .catch((error) => flashActions.showError(error));
  }

  function checkInvoiceErrorsAndSubmit() {
    if (insufficientFund.length || hasDuplicateInvoices) {
      const MySwal = withReactContent(Swal);
      const issues = [
        hasDuplicateInvoices ? 'Potential duplicate/s' : '',
        insufficientFund.length && alertMessage.length !== 0 ? alertMessage : ''
      ]
        .map((issue) =>
          issue.length > 0 ? `<li><span class="text--danger">- ${issue}</span></li>` : null
        )
        .join('');

      MySwal.fire({
        title: '<h2>Are you sure?</h2>',
        html: `
          <p>The following issues were identified</p>
          <ul>
          ${issues}
          </ul>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Approve',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        customClass: {
          title: 'swal2-title text--left',
          htmlContainer: 'swal2-html-container text--left',
          confirmButton: 'button button--primary',
          cancelButton: 'button button--secondary'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          debounceSubmit();
        }
      });
    } else {
      debounceSubmit();
    }
  }

  const debounceSubmit = useCallback(debounce(handleSubmit, 500, true), []);

  async function handleSubmit() {
    if (submitting) return null;

    setSubmitting(true);
    setAlertMessage('Approving...');

    let result = [];

    const approveAndPassInvoice = async (item) => {
      const params = {
        strata_master_status: insufficientFund.indexOf(item.sp_number) !== -1 ? 'hold' : 'active'
      };
      await axiosInstance
        .put(`v1/documents/${item.id}/invoice/approve_and_pass`, params)
        .then((res) => {
          result = [
            ...result,
            {
              ...item,
              invoice: res.data.invoice,
              currently_with_user_details: res.data.currently_with_user_details,
              bulkApproveSuccess: 'success'
            }
          ];
        })
        .catch((err) => {
          result = [...result, { ...item, bulkApproveError: flashActions.errorMessage(err) }];
        });
    };

    const batches = chunk(selectedItems, 1); // [[item1, item2, ..., item15], [item16, ..., item30]]

    while (batches.length) {
      const batch = batches.shift();
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map((promiseItem) => approveAndPassInvoice(promiseItem)));
    }

    setSubmitClicked(true);
    setSubmitting(false);

    if (result.length === 0) {
      dispatch(flashActions.showSuccess('All invoices approved successfully'));
      dispatch(modalActions.hideModal());
    } else {
      setInvoiceItems(result);
      setAlertMessage(
        'The outcome of the bulk approval is displayed above. For any that were not approved, please review them individually'
      );
      if (
        result.every((item) => item.bulkApproveSuccess && item.bulkApproveSuccess === 'success')
      ) {
        dispatch(flashActions.showSuccess('All invoices approved successfully'));
      } else {
        dispatch(flashActions.showError('Some of the selected invoices failed to approve.'));
      }
    }
  }

  function handleAfterClose() {
    if (submitClicked) setReload(true);
  }

  const lineItemsDescription = (attachment) => {
    if (
      !attachment?.invoice?.invoice_line_items ||
      attachment?.invoice?.invoice_line_items?.length === 0
    ) {
      return <span>N/A</span>;
    }

    return (
      <ul style={{ listStyleType: 'square', paddingLeft: '17px' }}>
        {attachment?.invoice?.invoice_line_items.map((item) => (
          <li key={item.id}>{item.description}</li>
        ))}
      </ul>
    );
  };

  return (
    <ModalContainer
      title='APPROVE INVOICES'
      reactModalProps={{
        onAfterClose: handleAfterClose,
        className: 'c-modal__container c-modal__container--lg'
      }}
    >
      <div className='c-modal__body bulk-approve-invoice-modal-body'>
        <p>* Invoices can only be Bulk Approved by the current Action User</p>
        <table className='table table--default' id='table-bulk-approve-invoice'>
          <thead>
            <tr>
              <th style={{ minWidth: '90px' }}>Date</th>
              <th>Plan Number</th>
              <th>Creditor</th>
              <th>Invoice No.</th>
              <th style={{ minWidth: '80px' }}>Invoice $</th>
              <th>Status</th>
              <th>Action</th>
              <th>Row Items</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item) => (
              <Fragment key={item.id}>
                {item?.bulkApproveError && (
                  <tr key={`${item.id}-error`} className='error'>
                    <td colSpan={8}>
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        size='sm'
                        className='text--danger'
                      />
                      &nbsp;&nbsp;
                      <span className='text--danger'>{item?.bulkApproveError}</span>
                    </td>
                  </tr>
                )}
                {item?.bulkApproveSuccess && (
                  <tr key={`${item.id}-success`} className='error'>
                    <td colSpan={8}>
                      <FontAwesomeIcon icon={faCheckCircle} size='sm' className='text--primary' />
                      &nbsp;&nbsp;
                      <span className='text--primary'>Approved</span>
                    </td>
                  </tr>
                )}

                <tr key={item.id} className={`${item?.invoice.is_duplicated ? 'duplicate' : ''}`}>
                  <td>
                    {item?.invoice?.date
                      ? moment(item?.invoice?.date, 'X').format(datetimeConstants.FORMAT.DEFAULT)
                      : 'N/A'}
                  </td>
                  <td>{item?.sp_number?.replace(/^sp/i, '')}</td>
                  <td>
                    {item?.contractor?.name
                      ? `${item?.contractor?.name} (${item?.contractor?.abn})`
                      : 'N/A'}
                  </td>
                  <td>{item?.invoice?.invoice_number ? item?.invoice?.invoice_number : 'N/A'}</td>
                  <td>
                    {`$${item?.invoice?.invoiced_price}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
                  </td>
                  <td className='invoice-status'>{item?.invoice?.status?.split('_')?.join(' ')}</td>
                  <td>
                    {item?.currently_with_user_details?.length !== 0 ? (
                      <Avatar
                        {...userOptionObj(item?.currently_with_user_details[0])}
                        size='xsmall'
                        showTooltip
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{lineItemsDescription(item)}</td>
                  <td>
                    <a href={`/invoice?id=${item.id}`} target='_blank' rel='noopener noreferrer'>
                      <FontAwesomeIcon icon={faExternalLinkAlt} size='sm' color='#4A90E2' />
                    </a>
                  </td>
                </tr>
                {item?.invoice.is_duplicated && !currentUser?.isStrataMember && (
                  <tr key={`${item.id}-error`} className='duplicate-label'>
                    <td colSpan={8}>
                      <span className='text--danger'>
                        ! This invoice is potentially a duplicate. Please review before approving
                      </span>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {alertMessage.length !== 0 && (
          <h5 className='text--danger' style={{ textAlign: 'center', marginTop: '10px' }}>
            {alertMessage}
          </h5>
        )}
      </div>
      <div className='c-modal__footer'>
        <button
          type='button'
          className='button button--secondary'
          onClick={() => dispatch(modalActions.hideModal())}
          disabled={submitting}
          style={{ minWidth: '100px' }}
        >
          CLOSE
        </button>
        {!submitClicked && (
          <button
            type='button'
            className='button button--primary'
            onClick={checkInvoiceErrorsAndSubmit}
            disabled={submitting}
            style={{ marginLeft: '15px' }}
          >
            APPROVE
          </button>
        )}
      </div>
    </ModalContainer>
  );
};

export default BulkApproveInvoice;
