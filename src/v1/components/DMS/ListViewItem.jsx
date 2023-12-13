import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Router from 'next/router';
import { faExclamationTriangle, faHandPaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tippy';
import { Avatar } from '../Avatar';
import { userOptionObj, axiosInstance } from '../../../utils';
import invoiceStatusText from './helpers/invoiceStatusText';
import { DropDown, FileType, Link, Modal } from '../index';
import { SharingModal } from './SharingModal';
import { InvoicePriority } from './InvoiceView';
import { invoiceConstants, datetimeConstants } from '../../../constants';
import { flashActions, modalActions, addAttachment, documentActions } from '../../../actions';
import RowItemsCollapse from './RowItemsCollapse';
import DocumentRowCollapse from './DocumentRowCollapse';
import FavoriteToggler from './FavoriteToggler';

import './ListViewItem.module.scss';

export const ListViewItem = ({
  item,
  selected,
  setSelected,
  setReload,
  favorites,
  action,
  unseen,
  currentlyWithUser,
  timeWith,
  expandedRows,
  windowWidth,
  activeDropDownId,
  toggleDropDown
}) => {
  const {
    file_extension: fileExtension,
    filename,
    display_name: displayName,
    category,
    added_date: addedDate,
    id,
    contractor,
    invoice,
    sp_number: spNumber,
    owner_id: ownerId,
    additional_users: additionalUsers,
    exported_to_strata_master: exportedToStrataMaster,
    extraction_status: extractionStatus,
    source,
    priority: initialPriority,
    job = {},
    is_deleted: isDeleted,
    is_invoice: isInvoice,
    notes,
    tags
  } = item;

  const currentUser = useSelector((state) => state.auth.currentUser);

  const [invoicePriority, setInvoicePriority] = useState(initialPriority);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const invoiceStatus =
    invoice && invoiceStatusText(invoice?.status, exportedToStrataMaster, extractionStatus);
  const hrefPath = category === 'invoice' ? '/invoice' : '/document-preview';
  const dispatch = useDispatch();
  const [priorityModal, setPriorityModal] = useState(null);
  const { id: jobId } = job;

  moment.updateLocale('en', { relativeTime: datetimeConstants.MOMENT_RELATIVE_TIME });

  const toggleDocumentSeen = async () => {
    if (unseen) {
      await axiosInstance
        .put(`/v1/documents/${id}/mark_as_seen`)
        .catch((error) => console.log(error));
    }
  };

  const showSharingModal = () => {
    setShowModal(true);
    setModalType('sharing-modal');
  };

  const showRemindActionUserModal = () => {
    dispatch(modalActions.showModal('REMIND_ACTION_USER', { docId: id, currentlyWithUser }));
  };

  const showDuplicateInvoiceModal = () => {
    dispatch(
      modalActions.showModal('DUPLICATE_INVOICE', { duplicatedDocumentId: invoice?.duplicate, id })
    );
  };

  const handleSendMessage = async () => {
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

  /**
   * If the priority is changed after a setReload, the initial
   * priority value is not the latest, hence listen for the changes and set state
   */
  useEffect(() => {
    setInvoicePriority(item.priority);
  }, [item.priority]);

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

  const dropDownOptions = () => {
    const options = [
      { label: 'View file', onClick: () => Router.push(`${hrefPath}?id=${id}`) },
      {
        label: 'View Building Profile',
        onClick: () => Router.push({ pathname: '/building-profile', query: { id: spNumber } })
      }
    ];

    if (currentUser?.isTenantManager) {
      options.push({ label: 'Share file', onClick: showSharingModal });
    }

    if (isInvoice && currentUser?.isTenantManager) {
      options.push({ label: 'Message Stakeholders', onClick: handleSendMessage });
    }

    if (isInvoice && currentUser?.isTenantManager && currentlyWithUser) {
      options.push({ label: 'Remind Action Users', onClick: showRemindActionUserModal });
    }

    const canDeleteDocument =
      currentUser?.isSystemManager ||
      (currentUser?.organisation_id && currentUser?.document_permissions?.['document.delete']);
    const canDeleteInvoice =
      currentUser?.isSystemManager ||
      (currentUser?.organisation_id && currentUser?.document_permissions?.['invoice.delete']);

    if (isInvoice && currentUser?.isTenantManager) {
      options.push({
        label: `${invoicePriority ? 'Remove' : 'Mark'} Priority`,
        onClick: () => setPriorityModal(true)
      });
    }

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

  const nonExistentCreditor = () => {
    const orgId = currentUser?.organisation_id;
    const contractorOrgIds = contractor?.active_external_resource_organisation_ids;

    return (
      orgId &&
      Array.isArray(contractorOrgIds) &&
      !contractorOrgIds?.includes(orgId) &&
      (currentUser.isSystemManager || currentUser.isTenantManager)
    );
  };

  return (
    <div
      className={`dms-list-view-item ${invoicePriority ? 'bg-light-red' : ''} ${
        action ? 'red-border' : ''
      } ${unseen ? 'unseen' : ''}`}
    >
      {isInvoice ? (
        <>
          <div className='dms-list-view-item-col file-selected invoice-select-all'>
            <div className='checkboxes-field'>
              <div className='option'>
                <input
                  id={`selected-file-${id}`}
                  name={`selected-file-${id}`}
                  onChange={(event) => setSelected(event, id)}
                  checked={selected.indexOf(id) !== -1}
                  type='checkbox'
                />
                <label htmlFor={`selected-file-${id}`} />
              </div>
            </div>
            <Link
              href={hrefPath}
              query={{ id }}
              onClick={() => {
                toggleDocumentSeen();
              }}
            >
              <FileType type={fileExtension} />
            </Link>
          </div>

          <span className='dms-list-view-item-col invoice-sp'>
            {spNumber ? (
              <Link href='/src/pages/v1/building-profile' query={{ id: spNumber }}>
                {spNumber.replace(/^sp/i, '')}
              </Link>
            ) : null}
          </span>

          <div className='dms-list-view-item-col invoice-contractor-name'>
            <Link href={hrefPath} query={{ id }} onClick={() => toggleDocumentSeen()}>
              {contractor.name || 'N/A'}
            </Link>
            {contractor?.abn_invalid && (
              <Tooltip
                arrow
                title={`Invalid ${currentUser?.business_number_label}`}
                animation='fade'
                theme='light'
                duration='200'
                position='bottom-start'
              >
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  size='sm'
                  color='red'
                  className='stop-icon'
                />
              </Tooltip>
            )}
            {nonExistentCreditor() && (
              <Tooltip
                arrow
                title='Creditor not in strata master'
                animation='fade'
                theme='light'
                duration='200'
                position='bottom-start'
              >
                <FontAwesomeIcon icon={faHandPaper} size='sm' color='red' className='stop-icon' />
              </Tooltip>
            )}
          </div>

          <div className='dms-list-view-item-col invoice-dms-status-container'>
            {invoiceStatus && (
              <div className={`invoice-status ${invoiceStatus.replace(/\s/g, '-')}`}>
                {invoiceStatus}
              </div>
            )}
          </div>

          <div className='dms-list-view-item-col invoice-no'>
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
            {invoice.invoice_number || 'N/A'}
          </div>

          <span className='dms-list-view-item-col invoice-amount'>
            {invoice.invoiced_price || 'N/A'}
          </span>

          <span className='dms-list-view-item-col invoice-added-date'>
            {moment.unix(addedDate).format('DD/MM/YYYY')}
          </span>

          {currentlyWithUser && (
            <span className='dms-list-view-item-col invoice-currently-with'>
              <div className='avatars'>
                {currentlyWithUser.map((user) => (
                  <Avatar {...user} size='xsmall' showTooltip key={user.id} />
                ))}
              </div>
            </span>
          )}

          <span className='dms-list-view-item-col time-with-item'>
            {timeWith ? moment.unix(timeWith).fromNow(true) : ''}
          </span>

          <span className='dms-list-view-item-col invoice-paid-date'>
            {invoice.payment_date ? moment.unix(invoice.payment_date).format('DD/MM/YYYY') : ''}
          </span>

          <span className='dms-list-view-item-col invoice-actions'>
            {invoice?.schedule_date && (
              <div className='icon-wrapper'>
                <Link
                  classNameProp='schedule-date'
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
          </span>
          {invoice?.invoice_line_items?.length > 0 && (
            <RowItemsCollapse invoice={invoice} expandedRows={expandedRows} />
          )}
        </>
      ) : (
        <>
          <div className='dms-list-view-item-col file-selected doc-select-all'>
            <div className='checkboxes-field'>
              <div className='option'>
                <input
                  id={`selected-file-${id}`}
                  name={`selected-file-${id}`}
                  onChange={(event) => setSelected(event, id)}
                  checked={selected.indexOf(id) !== -1}
                  type='checkbox'
                />
                <label htmlFor={`selected-file-${id}`} />
              </div>
            </div>
            <Link
              href={hrefPath}
              query={{ id }}
              onClick={() => {
                toggleDocumentSeen();
              }}
            >
              <FileType type={fileExtension} />
            </Link>
          </div>

          <span className='dms-list-view-item-col doc-sp'>
            {spNumber ? (
              <Link href='/src/pages/v1/building-profile' query={{ id: spNumber }}>
                {spNumber.replace(/^sp/i, '')}
              </Link>
            ) : null}
          </span>

          <span className='dms-list-view-item-col doc-type'>{category}</span>

          <div className='dms-list-view-item-col doc-name'>
            <Link href={hrefPath} query={{ id }} onClick={() => toggleDocumentSeen()}>
              {displayName}
            </Link>
          </div>

          <span className='dms-list-view-item-col doc-uploaded-date'>
            {moment.unix(addedDate).format('DD/MM/YYYY')}
          </span>

          <span className='dms-list-view-item-col doc-actions'>
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
          </span>
          {(notes || tags?.length > 0) && (
            <DocumentRowCollapse
              notes={notes}
              tags={tags}
              expandedRows={expandedRows}
              windowWidth={windowWidth}
            />
          )}
        </>
      )}

      {showModal && modalType === 'sharing-modal' ? (
        <SharingModal
          setShowModal={setShowModal}
          docId={id}
          spNumber={spNumber}
          additionalUsers={additionalUsers.map(userOptionObj)}
          ownerId={ownerId}
        />
      ) : null}

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
    </div>
  );
};
