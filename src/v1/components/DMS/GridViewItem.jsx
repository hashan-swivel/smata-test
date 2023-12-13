import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Router from 'next/router';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../Modal';
import { axiosInstance } from '../../../utils';
import { DropDown, Link, FileType } from '../index';
import { InvoicePriority } from './InvoiceView';
import { invoiceConstants } from '../../../constants';
import { addAttachment, documentActions, flashActions, modalActions } from '../../../actions';
import invoiceStatusText from './helpers/invoiceStatusText';
import FavoriteToggler from './FavoriteToggler';

import './GridViewItem.module.scss';

// TODO: Move action buttons to a seperated component to reduce duplicated code
export const GridViewItem = ({
  item,
  selected,
  setSelected,
  setReload,
  favorites,
  activeDropDownId,
  toggleDropDown
}) => {
  const [priorityModal, setPriorityModal] = useState(null);
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const {
    action,
    filename,
    display_name: displayName,
    category,
    sp_number: spNumber,
    file_extension: fileExtension,
    file_size: fileSize,
    added_date: addedDate,
    id,
    invoice,
    exported_to_strata_master: exportedToStrataMaster,
    extraction_status: extractionStatus,
    source,
    contractor,
    job = {},
    links,
    priority: initialPriority,
    is_deleted: isDeleted,
    is_invoice: isInvoice
  } = item;

  const [invoicePriority, setInvoicePriority] = useState(initialPriority);
  const invoiceStatus = invoiceConstants.UNCHANGEABLE_EXTERNAL_SOURCE_TYPES.includes(source)
    ? invoiceConstants.STATUSES.IMPORTED
    : invoice && invoiceStatusText(invoice.status, exportedToStrataMaster, extractionStatus);

  const fileUrl = links?.pdf_url || links?.file_url;
  const { id: jobId } = job;

  const thumbnail = () => {
    if (links?.thumb_url) {
      return (
        <img
          src={links?.thumb_url}
          alt=''
          className='dms-thumbnail-img'
          loading='lazy'
          onClick={() => openPreview()}
        />
      );
    }

    return (
      <a href='#' onClick={() => openPreview()}>
        <FileType type={fileExtension} size='xlarge' />
      </a>
    );
  };

  useEffect(() => {
    setInvoicePriority(item.priority);
  }, [item.priority]);

  const viewDocument = () => {
    Router.push(documentUrl);
  };

  const openPreview = () => {
    dispatch(
      modalActions.showModal('DOCUMENT_PREVIEW', {
        fileUrl,
        filename,
        fileExtension,
        fileSize,
        addedDate: item.added_date,
        documentUrl
      })
    );
  };

  const onToggleInvoicePriority = async (_id, priority, reason) => {
    try {
      await axiosInstance
        .put(`/v1/documents/${id}/update_priority`, { reason, priority })
        .then(() => {
          setInvoicePriority(priority);
          setPriorityModal(false);
          dispatch(flashActions.showSuccess('Document has been updated successfully'));
          setTimeout(() => setReload(true), 1200); // without the delay document API returns old data
        });
    } catch (error) {
      setPriorityModal(false);
      dispatch(flashActions.showError(error));
    }
  };

  const handleSendMessage = async (e) => {
    if (!spNumber) return;

    await axiosInstance
      .get(`/v1/building_profile/${encodeURIComponent(spNumber)}`)
      .then((res) => {
        const creditorName = contractor ? contractor.name : '';
        const attachment = {
          id,
          spNumber,
          locations: res?.data.locations,
          category,
          users: res?.data?.building_rules?.one_off_invoices?.approvers,
          creditorName,
          filename,
          can_message: res.data.can_message
        };

        window.localStorage.setItem('message_attachment', JSON.stringify(attachment));
        dispatch(addAttachment(attachment));
        window.open(`${window.location.origin}/messages?createMessage=true`, '_blank');
      })
      .catch((error) => flashActions.showError(error));
  };

  const dropDownOptions = () => {
    const options = [
      { label: 'View file', onClick: viewDocument },
      {
        label: 'View Building Profile',
        onClick: () => Router.push({ pathname: '/building-profile', query: { id: spNumber } })
      }
    ];

    if (isInvoice && currentUser?.isTenantManager) {
      options.push({ label: 'Message Stakeholders', onClick: handleSendMessage });
    }

    if (isInvoice && currentUser?.isTenantManager) {
      options.push({
        label: `${invoicePriority ? 'Remove' : 'Mark'} Priority`,
        onClick: () => setPriorityModal(true)
      });
    }

    const canDeleteDocument =
      currentUser?.isSystemManager ||
      (currentUser?.organisation_id && currentUser?.document_permissions?.['document.delete']);
    const canDeleteInvoice =
      currentUser?.isSystemManager ||
      (currentUser?.organisation_id && currentUser?.document_permissions?.['invoice.delete']);

    if (isInvoice && canDeleteInvoice && !isDeleted) {
      options.push({
        label: 'Delete',
        onClick: () =>
          dispatch(
            documentActions.deleteDocument(id, () => setTimeout(() => setReload(true), 1100))
          ),
        className: 'dropdown-item--danger'
      });
    }

    if (!isInvoice && canDeleteDocument && !isDeleted) {
      options.push({
        label: 'Delete',
        onClick: () =>
          dispatch(
            documentActions.deleteDocument(id, () => setTimeout(() => setReload(true), 1100))
          ),
        className: 'dropdown-item--danger'
      });
    }

    return options;
  };
  const hrefPath = category === 'invoice' ? '/invoice' : '/document-preview';
  const documentUrl = `${hrefPath}?id=${id}`;

  const showDuplicateInvoiceModal = () => {
    dispatch(
      modalActions.showModal('DUPLICATE_INVOICE', { duplicatedDocumentId: invoice?.duplicate, id })
    );
  };

  return (
    <div
      className={`dms-grid-view-item ${invoicePriority ? 'bg-light-red' : ''} ${
        action ? 'red-border' : ''
      }`}
    >
      <div className='dms-grid-view-item-actions'>
        <div className='dms-grid-view-item-actions-left'>
          <div className='file-selected'>
            <div className='checkboxes-field'>
              <div className='option'>
                <input
                  className='input'
                  id={`selected-file-${id}`}
                  name={`selected-file-${id}`}
                  onChange={(event) => setSelected(event, id)}
                  checked={selected.indexOf(id) !== -1}
                  type='checkbox'
                />
                <label className='label' htmlFor={`selected-file-${id}`} />
              </div>
            </div>
          </div>
        </div>
        {priorityModal ? (
          <Modal active={priorityModal} closeModal={() => setPriorityModal(false)}>
            <InvoicePriority
              closeModal={() => setPriorityModal(false)}
              documentName={displayName}
              id={id}
              invoicePriority={invoicePriority}
              onToggleInvoicePriority={onToggleInvoicePriority}
            />
          </Modal>
        ) : null}
        <div className='dms-grid-view-item-actions-right'>
          {invoice?.schedule_date && (
            <div className='icon-wrapper'>
              <Link
                classNameProp='job-link'
                href='#'
                target='_self'
                title={`Scheduled payment date: ${moment
                  .unix(invoice?.schedule_date)
                  .format('DD/MM/YYYY')}`}
              >
                <span className='icon icon-calendar-dark' />
              </Link>
            </div>
          )}
          {jobId && (currentUser?.isTenantManager || currentUser?.isSystemManager) && (
            <div className='icon-wrapper'>
              <Link
                classNameProp='job-link'
                href={`${currentUser?.baseUrlWithNameSpace}/jobs/${jobId}`}
                target='_blank'
                title='Associated Job'
              >
                <span className='icon icon-smata-work-dark' />
              </Link>
            </div>
          )}
          <div className='icon-wrapper'>
            <FavoriteToggler attachmentId={id} favorites={favorites} dispatch={dispatch} />
          </div>
          <DropDown
            id={`dropdown-item-${id}`}
            toggleDropDown={toggleDropDown}
            isActive={activeDropDownId === `dropdown-item-${id}`}
            hideIcon
            alignRight
            label='...'
            options={dropDownOptions()}
          />
        </div>
      </div>
      <div className='dms-ref-view'>
        <div className='dms-grid-view-item-body'>
          <div className='dms-grid-view-item-container'>
            {thumbnail()}
            <div className='dms-grid-item-name' title={displayName}>
              {displayName}
            </div>
            <div className='dms-grid-item-category' title={category}>
              {category}
            </div>
            {invoiceStatus && (
              <div className='dms-grid-item-invoice-status'>
                {invoice?.is_duplicated && !currentUser?.isStrataMember && (
                  <Tooltip
                    arrow
                    title='Duplicate Found'
                    animation='fade'
                    theme='light'
                    duration='200'
                    position='bottom-start'
                  >
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      size='sm'
                      color='red'
                      onClick={showDuplicateInvoiceModal}
                      className='duplicate-icon'
                    />
                  </Tooltip>
                )}
                <span
                  className={`invoice-status ${invoiceStatus.replace(/\s/g, '-')}`}
                  title={invoiceStatus}
                >
                  {invoiceStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='dms-grid-view-item-footer'>
        <span className='dms-list-view-item-col file-size'>{spNumber?.replace(/^sp/i, '')}</span>
        <span className='dms-list-view-item-col file-uploaded'>
          {moment.unix(addedDate).format('DD/MM/YYYY')}
        </span>
      </div>
    </div>
  );
};
