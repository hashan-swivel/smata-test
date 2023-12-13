import React, { useMemo, useState, useRef, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import Router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { reset } from 'redux-form';
import { Tooltip } from 'react-tippy';
import Switch from 'react-switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faChartLine,
  faDollarSign,
  faList,
  faPlus,
  faThLarge,
  faWindowMaximize
} from '@fortawesome/free-solid-svg-icons';
import { Search } from './Search';
import { modalActions } from '../../../actions';
import { ContinueModal } from '../index';
import { Modal } from '../Modal';
import { FileUpload } from './FileUpload/FileUpload';
import { UploadSuccessModal } from './FileUpload/UploadSuccessModal';
import { setFilters, setSortOptions, setToggleActions } from '../../../actions/dms';
import { switchConstants, documentConstants } from '../../../constants';
import { isOwner, isOwnerSubRole } from '../../../utils';

import 'flatpickr/dist/themes/material_green.css';
import './Header.module.scss';

export const Header = ({
  showMyTasks,
  actionRequired,
  view,
  setView,
  onDateChange,
  setCurrentPage,
  viewType,
  setViewType,
  spNumberQuery,
  dateRange,
  setDateRange,
  currentUser,
  expandedRows,
  setExpandedRows,
  sort,
  order,
  currentPage,
  perPage,
  setPerPage
}) => {
  const toggleState = useSelector((state) => state.dms.toggleActions);

  const favoriteState = toggleState.favorite;
  const allState = toggleState.all;
  const taskState = toggleState.task;
  const deletedState = toggleState.deleted;
  const duplicateState = toggleState.duplicate;
  const priorityInvoiceState = toggleState.priority_invoice;
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [continueModal, setContinueModal] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [documentUploadType, setDocumentUploadType] = useState('document'); // document or invoice
  const canAddDocument = !(currentUser?.isStrataMember || currentUser?.isBuildingInspector);
  const canToggleViewAllDocument =
    viewType === 'documents' &&
    (currentUser?.isSystemManager ||
      (currentUser.organisation_id && currentUser?.document_permissions?.['document.view_all']));
  const canToggleViewAllInvoice =
    viewType === 'invoices' &&
    (currentUser?.isSystemManager ||
      (currentUser.organisation_id && currentUser?.document_permissions?.['invoice.view_all']));
  const canToggleViewDeletedDocument = currentUser?.isSystemManager || currentUser?.isTenantManager;
  const canToggleViewDuplicateInvoice = viewType === 'invoices' && currentUser?.isTenantManager;

  const canViewFinancialReports = useMemo(
    () => currentUser?.organisation_id && currentUser?.isTenantManager,
    [currentUser]
  );

  const localStorageToggleActionsKey = () =>
    viewType === 'documents'
      ? documentConstants.SHOW_ALL_DOCUMENTS_KEY
      : documentConstants.SHOW_ALL_INVOICES_KEY;

  const getSavedAllDocumentsToggleValue = () => {
    const value = window.localStorage.getItem(documentConstants.SHOW_ALL_DOCUMENTS_KEY) === 'true';

    if (value === true) {
      dispatch(
        setToggleActions({ favorites: false, my_tasks: false, is_invoice: false, all: true })
      );
    }

    return value;
  };

  const getSavedAllInvoicesToggleValue = () => {
    const value = window.localStorage.getItem(documentConstants.SHOW_ALL_INVOICES_KEY) === 'true';

    if (value === true) {
      dispatch(
        setToggleActions({ favorites: false, my_tasks: false, is_invoice: true, all: true })
      );
    }

    return value;
  };

  const canFilterLevyNotices = useMemo(
    () => (currentUser?.isStrataMember && isOwnerSubRole(currentUser)) || isOwner(currentUser),
    [currentUser]
  );

  const refDatePicker = useRef();
  const dispatch = useDispatch();
  const fileFormState = useSelector((state) => state.form.files);
  const { values } = fileFormState || {};

  const clearDatePicker = () => {
    refDatePicker.current.flatpickr.clear();
    setDateRange([]);
  };

  const handleViewChange = (event, newView) => {
    event.preventDefault();
    window.localStorage.setItem(documentConstants.VIEW_TYPE_KEY, newView);
    setView(newView);
  };

  const handleExpandRows = (event, value) => {
    if (event) event.preventDefault();
    window.localStorage.setItem(documentConstants.VIEW_EXPANDED_ROWS_KEY, value);
    setExpandedRows(value);
  };

  const openModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(true);
  };

  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
  };

  const successModalEvent = () => {
    setShowSuccessModal(true);
  };

  const handleContinue = () => {
    dispatch(reset('files'));
    setContinueModal(false);
    setShowModal(false);
  };

  const handleCancel = () => {
    setContinueModal(false);
  };

  // When the 'close' button is toggled
  const toggleCloseButton = (event) => {
    // If there are files waiting to be uploaded, confirm they want to close
    if (values?.file.length >= 1) {
      setContinueModal(true);
    } else {
      return closeModal(event);
    }
  };

  const changeViewTypeHandler = (newViewType) => {
    Router.push(`/documents${newViewType === 'invoices' ? '?showInvoice=true' : ''}`);
    setPerPage(50);
    clearDatePicker();
    setViewType(newViewType);
    handleExpandRows(null, false);
    toggleHandler({}, false);
  };

  const changeAssignedTasksHandler = () => {
    setViewType('invoices');
    toggleHandler({ showFavoriteTasks: favoriteState, showAssignedTasks: true });
  };

  const fetchLevyNotices = async () => {
    dispatch(setToggleActions({ favorites: false, my_tasks: false, is_invoice: false }));
    dispatch(setFilters([{ type: 'type', item: 'Levy Notice' }]));
  };

  const toggleHandler = (action = {}, saveAllState = true) => {
    setCurrentPage(1);

    if (saveAllState) {
      window.localStorage.setItem(localStorageToggleActionsKey(), action.showOrgDocuments || false);
    }

    const actions = {
      favorite: action.showFavoriteTasks || false,
      all: action.showOrgDocuments || false,
      task: action.showAssignedTasks || false,
      priority_invoice: action.showPriorityInvoices || false,
      deleted: action.showDeleted || false,
      duplicate: action.showDuplicates || false
    };

    dispatch(setToggleActions(actions));
    if (action.showAssignedTasks) {
      dispatch(setSortOptions('invoice.status', 'desc'));
    }
  };

  const uploadDropdownItemClickHandler = (type) => {
    setDocumentUploadType(type);
    openModal();
    setShowUploadDropdown(false);
  };

  useEffect(() => {
    if (showMyTasks) {
      changeAssignedTasksHandler();
    }
  }, [showMyTasks]);

  // Handle clicking off the upload dropdown
  useEffect(() => {
    function handleClick({ target }) {
      const { className } = target;

      if (typeof className === 'string' && !className.includes('document-upload-dropdown')) {
        setShowUploadDropdown(false);
      }
    }

    if (showUploadDropdown) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [showUploadDropdown]);

  function openDatePicker() {
    refDatePicker.current.flatpickr.open();
  }

  return (
    <section className='dms-header'>
      <div className='dms-header--top'>
        <div className='dms-header-title-wrapper'>
          <div
            className={`dms-header-title documents ${
              viewType === 'documents' ? 'active' : 'inactive'
            }`}
            role='presentation'
            onClick={() => changeViewTypeHandler('documents')}
          >
            Documents
          </div>
          <div
            className={`dms-header-title invoices ${
              viewType === 'invoices' ? 'active' : 'inactive'
            }`}
          >
            <div role='presentation' onClick={() => changeViewTypeHandler('invoices')}>
              <span>Invoices</span>
            </div>
            {actionRequired > 0 && (
              <span
                className='badge badge--pill badge--danger'
                role='presentation'
                onClick={changeAssignedTasksHandler}
              >
                <Tooltip
                  arrow
                  title='Invoices that have been shared with you and require you to review and action/approve'
                  position='bottom'
                  animation='fade'
                  theme='light'
                >
                  {actionRequired}
                </Tooltip>
              </span>
            )}
          </div>
        </div>
        <div className='dms-filters'>
          {canToggleViewAllInvoice && (
            <Switch
              onChange={() => toggleHandler({ showOrgDocuments: !allState })}
              checked={allState || getSavedAllInvoicesToggleValue()}
              {...switchConstants.DEFAULT_STYLE}
              width={85}
              uncheckedIcon={
                <div style={{ ...switchConstants.UNCHECKED_ICON_DEFAULT_STYLE, paddingRight: 30 }}>
                  All
                </div>
              }
              checkedIcon={
                <div style={{ ...switchConstants.CHECKED_ICON_DEFAULT_STYLE, paddingLeft: 30 }}>
                  All
                </div>
              }
              className='dms-filter'
            />
          )}

          {canToggleViewAllDocument && (
            <Switch
              onChange={() => toggleHandler({ showOrgDocuments: !allState })}
              checked={allState || getSavedAllDocumentsToggleValue()}
              {...switchConstants.DEFAULT_STYLE}
              width={85}
              uncheckedIcon={
                <div style={{ ...switchConstants.UNCHECKED_ICON_DEFAULT_STYLE, paddingRight: 30 }}>
                  All
                </div>
              }
              checkedIcon={
                <div style={{ ...switchConstants.CHECKED_ICON_DEFAULT_STYLE, paddingLeft: 30 }}>
                  All
                </div>
              }
              className='dms-filter'
            />
          )}

          {viewType === 'invoices' && (
            <Switch
              onChange={() => toggleHandler({ showAssignedTasks: !taskState })}
              checked={taskState}
              {...switchConstants.DEFAULT_STYLE}
              width={85}
              uncheckedIcon={
                <div style={{ ...switchConstants.UNCHECKED_ICON_DEFAULT_STYLE, paddingRight: 20 }}>
                  Tasks
                </div>
              }
              checkedIcon={
                <div style={{ ...switchConstants.CHECKED_ICON_DEFAULT_STYLE, paddingLeft: 20 }}>
                  Tasks
                </div>
              }
              className='dms-filter'
            />
          )}

          {viewType === 'invoices' && (
            <Switch
              onChange={() => toggleHandler({ showPriorityInvoices: !priorityInvoiceState })}
              checked={priorityInvoiceState}
              {...switchConstants.DEFAULT_STYLE}
              width={85}
              uncheckedIcon={
                <div style={{ ...switchConstants.UNCHECKED_ICON_DEFAULT_STYLE, paddingRight: 10 }}>
                  Priority
                </div>
              }
              checkedIcon={
                <div style={{ ...switchConstants.CHECKED_ICON_DEFAULT_STYLE, paddingLeft: 10 }}>
                  Priority
                </div>
              }
              className='dms-filter'
            />
          )}

          <Switch
            onChange={() => toggleHandler({ showFavoriteTasks: !favoriteState })}
            checked={favoriteState}
            {...switchConstants.DEFAULT_STYLE}
            width={105}
            uncheckedIcon={
              <div style={{ ...switchConstants.UNCHECKED_ICON_DEFAULT_STYLE, paddingRight: 10 }}>
                Favourites
              </div>
            }
            checkedIcon={
              <div style={{ ...switchConstants.CHECKED_ICON_DEFAULT_STYLE, paddingLeft: 10 }}>
                Favourites
              </div>
            }
            className='dms-filter'
          />

          {canToggleViewDeletedDocument && (
            <Switch
              onChange={() => toggleHandler({ showDeleted: !deletedState })}
              checked={deletedState}
              {...switchConstants.DEFAULT_STYLE}
              width={85}
              uncheckedIcon={
                <div style={{ ...switchConstants.UNCHECKED_ICON_DEFAULT_STYLE, paddingRight: 10 }}>
                  Deleted
                </div>
              }
              checkedIcon={
                <div style={{ ...switchConstants.CHECKED_ICON_DEFAULT_STYLE, paddingLeft: 10 }}>
                  Deleted
                </div>
              }
              className='dms-filter'
            />
          )}

          {canToggleViewDuplicateInvoice && (
            <Switch
              onChange={() => toggleHandler({ showDuplicates: !duplicateState })}
              checked={duplicateState}
              {...switchConstants.DEFAULT_STYLE}
              width={105}
              uncheckedIcon={
                <div style={{ ...switchConstants.UNCHECKED_ICON_DEFAULT_STYLE, paddingRight: 10 }}>
                  Duplicates
                </div>
              }
              checkedIcon={
                <div style={{ ...switchConstants.CHECKED_ICON_DEFAULT_STYLE, paddingLeft: 10 }}>
                  Duplicates
                </div>
              }
              className='dms-filter'
            />
          )}
        </div>
      </div>
      <div className='dms-header--bottom'>
        <Search
          viewType={viewType}
          spNumberQuery={spNumberQuery}
          dateRange={dateRange}
          sort={sort}
          order={order}
          currentPage={currentPage}
          perPage={perPage}
        />
        <div className='dms-actions'>
          {view === 'list' && (
            <button
              type='button'
              className={`button button__expanded-view ${expandedRows ? 'active' : 'inactive'}`}
              onClick={(event) => handleExpandRows(event, !expandedRows)}
            >
              <Tooltip
                className='tooltip-icon'
                arrow
                title='Expanded List View'
                position='bottom'
                animation='fade'
                theme='light'
              >
                <FontAwesomeIcon icon={faWindowMaximize} size='lg' />
              </Tooltip>
            </button>
          )}
          <div className='dms-date-filter'>
            {dateRange?.length === 2 && (
              <input
                className='dms-date-filter__input'
                type='text'
                value={`${dateRange[0]} - ${dateRange[1]}`}
                disabled
              />
            )}
            <Flatpickr
              options={{ dateFormat: 'd/m/Y', mode: 'range' }}
              onChange={(e) => onDateChange(e)}
              ref={refDatePicker}
              style={{
                height: 0,
                width: 0,
                padding: 0,
                opacity: 0,
                position: 'absolute',
                top: 30,
                right: 0
              }}
            />
            <button
              type='button'
              className={`button button__added-date-filter ${
                dateRange?.length === 2 ? 'active' : 'inactive'
              }`}
              onClick={openDatePicker}
            >
              <Tooltip
                className='tooltip-icon'
                arrow
                title='Date Range'
                position='bottom'
                animation='fade'
                theme='light'
              >
                <FontAwesomeIcon icon={faCalendarAlt} size='lg' />
              </Tooltip>
            </button>
            {dateRange?.length === 2 && (
              <button
                type='button'
                className='icon icon-cross-red'
                style={{
                  background: 'none',
                  border: 'none',
                  top: 14,
                  left: 2,
                  position: 'absolute',
                  display: 'flex'
                }}
                onClick={clearDatePicker}
              />
            )}
          </div>

          <button
            type='button'
            className={`button button__list-view ${view === 'list' ? 'active' : 'inactive'}`}
            onClick={(event) => handleViewChange(event, 'list')}
          >
            <Tooltip
              className='tooltip-icon'
              arrow
              title='List View'
              position='bottom'
              animation='fade'
              theme='light'
            >
              <FontAwesomeIcon icon={faList} size='lg' />
            </Tooltip>
          </button>
          <button
            type='button'
            className={`button button__grid-view ${view === 'grid' ? 'active' : 'inactive'}`}
            onClick={(event) => handleViewChange(event, 'grid')}
          >
            <Tooltip
              className='tooltip-icon'
              arrow
              title='Grid View'
              position='bottom'
              animation='fade'
              theme='light'
            >
              <FontAwesomeIcon icon={faThLarge} size='lg' />
            </Tooltip>
          </button>

          {canViewFinancialReports && (
            <button
              type='button'
              className='button button__financial-report inactive'
              onClick={() => dispatch(modalActions.showModal('FINANCIAL_REPORT', {}))}
            >
              <Tooltip
                className='tooltip-icon'
                arrow
                title='Request Reports'
                position='bottom'
                animation='fade'
                theme='light'
              >
                <FontAwesomeIcon icon={faChartLine} size='lg' />
              </Tooltip>
            </button>
          )}
          {canFilterLevyNotices && (
            <button
              type='button'
              className='button button__levy-notice inactive'
              onClick={fetchLevyNotices}
            >
              <Tooltip
                className='tooltip-icon'
                arrow
                title='Levy notices'
                position='bottom'
                animation='fade'
                theme='light'
              >
                <FontAwesomeIcon icon={faDollarSign} size='lg' />
              </Tooltip>
            </button>
          )}
          {canAddDocument && (
            <div className='add-button-wrapper'>
              <button
                type='button'
                className='button button__add'
                onClick={() => setShowUploadDropdown(true)}
              >
                <Tooltip
                  className='tooltip-icon'
                  arrow
                  title='Add New'
                  position='bottom'
                  animation='fade'
                  theme='light'
                >
                  <FontAwesomeIcon icon={faPlus} size='lg' />
                </Tooltip>
              </button>
              {showUploadDropdown && (
                <div className='document-upload-dropdown'>
                  <span
                    role='presentation'
                    onClick={() => uploadDropdownItemClickHandler('document')}
                  >
                    Add Document
                  </span>
                  <span
                    role='presentation'
                    onClick={() => uploadDropdownItemClickHandler('invoice')}
                  >
                    Add Invoice
                  </span>
                </div>
              )}
            </div>
          )}
          {showSuccessModal && <UploadSuccessModal />}
          {continueModal && (
            <ContinueModal handleCancel={handleCancel} handleContinue={handleContinue} />
          )}
          <Modal
            active={showModal}
            closeModal={toggleCloseButton}
            setContinueModal={setContinueModal}
            className='dropzone-modal'
            type='uploader'
          >
            <FileUpload
              closeModal={closeModal}
              successModalEvent={successModalEvent}
              setContinueModal={setContinueModal}
              type={documentUploadType}
            />
          </Modal>
        </div>
      </div>
    </section>
  );
};
