import React, { useState, useEffect, Fragment } from 'react';
import * as moment from 'moment';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance, chunk, userOptionObj } from '../../../../utils';
import { flashActions, modalActions } from '../../../../actions';
import ModalContainer from '../../Modals/ModalContainer';
import { Loading } from '../../Loading.jsx';
import { Link } from '../../Link.jsx';
import { NotFound } from '../NotFound.jsx';
import { Avatar } from '../../Avatar';
import invoiceStatusText from '../helpers/invoiceStatusText';
import { datetimeConstants, invoiceConstants } from '../../../../constants';
import { convertToInvoiceStateable } from '../../../../utils/invoiceStatusHelpers';

import './DuplicatedInvoicesModal.module.scss';

const DuplicatedInvoicesModal = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [duplicatedInvoices, setDuplicatedInvoices] = useState([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const canCancel = currentUser?.isTenantMananger || currentUser?.isSystemManager;

  useEffect(() => {
    fetchDuplicatedInvoices();
  }, []);

  const toggleSelectAll = (e) => {
    if (e.target.checked === true) {
      const cancellableInvoices = duplicatedInvoices.filter(
        (d) =>
          invoiceConstants.CANCELABLE_STATUSES.indexOf(
            convertToInvoiceStateable(d?.invoice?.status)
          ) !== -1
      );
      setSelectedInvoiceIds(cancellableInvoices.map((d) => d.id));
    } else {
      setSelectedInvoiceIds([]);
    }
  };

  const toggleInvoiceSelection = (e) => {
    const selectedId = parseInt(e.target.dataset.id, 10);

    if (e.target.checked) {
      setSelectedInvoiceIds([...selectedInvoiceIds, selectedId]);
    } else {
      setSelectedInvoiceIds(selectedInvoiceIds.filter((i) => i !== selectedId));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let result = [];
    let failed = false;

    const approveAndPassInvoice = async (item) => {
      await axiosInstance
        .patch(`v1/documents/${item.id}/invoice/cancel`)
        .then(() => {
          result = [
            ...result,
            {
              ...item,
              invoice: { ...item?.invoice, status: 'cancelled' },
              cancelError: null,
              cancelSucceed: 'success'
            }
          ];
        })
        .catch((err) => {
          failed = true;
          result = [
            ...result,
            { ...item, cancelSucceed: null, cancelError: flashActions.errorMessage(err) }
          ];
        });
    };

    const batches = chunk(duplicatedInvoices, 1); // [[item1, item2, ..., item15], [item16, ..., item30]]

    while (batches.length) {
      const batch = batches.shift();
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map((promiseItem) => approveAndPassInvoice(promiseItem)));
    }

    if (failed) {
      setDuplicatedInvoices(result);
      dispatch(
        flashActions.showError(
          'Some of the selected invoices failed to approve. Please review them individually'
        )
      );
      setSubmitting(false);
    } else {
      flashActions.showSuccess('Invoice(s) have been canceled');
      setDuplicatedInvoices(result);
    }
  };

  const fetchDuplicatedInvoices = async () => {
    setLoading(true);
    await axiosInstance
      .get(`/v1/documents/${id}/invoice/duplicates`)
      .then((res) => {
        const documents = res?.data?.documents;
        if (documents.length > 0) {
          setDuplicatedInvoices(documents);
        } else {
          setDuplicatedInvoices([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setDuplicatedInvoices([]);
        setLoading(false);
      });
  };

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

  const duplicateInvoiceItem = (item) => {
    const disabled =
      invoiceConstants.CANCELABLE_STATUSES.indexOf(
        convertToInvoiceStateable(item?.invoice?.status)
      ) === -1;

    return (
      <Fragment key={item.id}>
        {item?.cancelError && (
          <tr key={`${item.id}-error`} className='error'>
            <td />
            <td colSpan={9}>
              <span className='text--danger'>{item?.cancelError}</span>
            </td>
          </tr>
        )}
        {item?.cancelSucceed && (
          <tr key={`${item.id}-success`} className='error'>
            <td />
            <td colSpan={9}>
              <span className='text--primary'>Success</span>
            </td>
          </tr>
        )}
        <tr key={item.id}>
          {canCancel && (
            <td>
              <div className='checkboxes-field'>
                <div className='option'>
                  <input
                    id={`selected-duplicate-file-${item.id}`}
                    data-id={item.id}
                    onChange={toggleInvoiceSelection}
                    checked={selectedInvoiceIds.indexOf(item.id) !== -1}
                    type='checkbox'
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`selected-duplicate-file-${item.id}`}
                    className={disabled ? 'inactive' : null}
                  />
                </div>
              </div>
            </td>
          )}
          <td>{moment(item?.invoice?.date, 'X').format(datetimeConstants.FORMAT.DEFAULT)}</td>
          <td>{item?.sp_number?.replace(/^sp/i, '')}</td>
          <td>
            {item?.contractor?.name} ({item?.contractor?.abn})
          </td>
          <td>{item?.invoice?.invoice_number}</td>
          <td>{`$${item?.invoice?.invoiced_price}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}</td>
          <td className='invoice-status'>{invoiceStatusText(item?.invoice?.status)}</td>
          <td>
            {item?.currently_with_user_details && item.currently_with_user_details.length !== 0 ? (
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
            <Link
              href='/src/pages/v1/invoice'
              query={{ id: item.id }}
              classNameProp='link'
              target='_blank'
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </Link>
          </td>
        </tr>
      </Fragment>
    );
  };

  const duplicatedInvoicesContainer = () => {
    if (loading) {
      return <Loading />;
    }

    if (duplicatedInvoices.length === 0) {
      return <NotFound text='No Duplicate Invoices' />;
    }

    return (
      <table className='table table--default'>
        <thead>
          <tr>
            {canCancel && (
              <th>
                <div className='checkboxes-field'>
                  <div className='option'>
                    <input
                      id='select-all'
                      name='select-all'
                      onChange={toggleSelectAll}
                      type='checkbox'
                    />
                    <label htmlFor='select-all' />
                  </div>
                </div>
              </th>
            )}
            <th className='date-col'>Date</th>
            <th>Plan Number</th>
            <th>Creditor</th>
            <th>Invoice No.</th>
            <th className='invoice-price-col'>Invoice $</th>
            <th>Status</th>
            <th>Action</th>
            <th>Row Items</th>
            <th />
          </tr>
        </thead>
        <tbody>{duplicatedInvoices.map(duplicateInvoiceItem)}</tbody>
      </table>
    );
  };

  return (
    <ModalContainer
      title='Duplicate Invoices'
      reactModalProps={{ className: 'c-modal__container c-modal__container--lg' }}
    >
      <div className='c-modal__body duplicated-invoices-modal-container'>
        <p style={{ fontStyle: 'italic', color: 'red' }}>
          * Duplicate matches are not sensitive to space, hyphens and hash symbols in the invoice
          number
        </p>
        {duplicatedInvoicesContainer()}
      </div>
      <div className='c-modal__footer'>
        <button
          type='button'
          className='button button--link-dark'
          onClick={() => dispatch(modalActions.hideModal())}
          disabled={loading || submitting}
        >
          Close
        </button>
        {canCancel && (
          <button
            type='button'
            className='button danger'
            onClick={handleSubmit}
            style={{ marginLeft: '10px' }}
            disabled={selectedInvoiceIds.length === 0 || loading || submitting}
          >
            Bulk Cancel
          </button>
        )}
      </div>
    </ModalContainer>
  );
};

export default DuplicatedInvoicesModal;
