import React from 'react';
import { connect } from 'react-redux';
import { bulkDeleteDocuments } from '../../../actions/dms';
import { documentActions, modalActions } from '../../../actions';
import { userOptionObj } from '../../../utils';
import { MyDropdown } from '../MyDropdown';

import './BulkActionBar.module.scss';

const selectStyles = {
  control: (provided) => ({
    ...provided,
    display: 'none'
  }),
  option: (styles, { data }) => {
    return {
      ...styles,
      color:
        data?.value === 'delete_documents' || data?.value === 'delete_invoices'
          ? '#FF0000'
          : '#353535'
    };
  },
  menu: () => ({
    boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
    width: 'max-content',
    minWidth: '100%'
  }),
  menuList: () => ({
    minHeight: 'fit-content'
  })
};

const BulkActionBar = ({
  documents,
  dispatch,
  selectedItemIds,
  setSelectedItemIds,
  setAllSelected,
  setReload,
  currentUser,
  viewType
}) => {
  if (selectedItemIds?.length < 1 || currentUser?.isSupport) return null;
  const isInvoice = viewType === 'invoices';
  const selectedItems = documents.filter((item) => selectedItemIds.includes(item.id));

  const deleteBulk = () => {
    dispatch(bulkDeleteDocuments(selectedItems, setReload));
  };

  const exportBulk = () => {
    dispatch(documentActions.downloadAndZipDocuments(selectedItems));
  };

  const updateBulk = () => {
    dispatch(modalActions.showModal('BULK_UPDATE_CATEGORY', { selectedItems, setReload }));
  };

  const renameBulk = () => {
    dispatch(modalActions.showModal('BULK_APPLY_SUGGESTED_NAME', { selectedItems, setReload }));
  };

  const bulkApproveInvoices = () => {
    dispatch(modalActions.showModal('BULK_APPROVE_INVOICE', { selectedItems, setReload }));
  };

  const bulkChangeInvoicePriority = (newPriority) => {
    dispatch(
      modalActions.showModal('BULK_UPDATE_PRIORITY', { selectedItems, setReload, newPriority })
    );
  };

  const bulkDropdownOptions = () => {
    const canDeleteDocument =
      currentUser?.isSystemManager ||
      (currentUser?.organisation_id && currentUser?.document_permissions?.['document.delete']);
    const canDeleteInvoice =
      currentUser?.isSystemManager ||
      (currentUser?.organisation_id && currentUser?.document_permissions?.['invoice.delete']);
    const canUpdateDocument =
      currentUser?.isOrganisationAdmin ||
      (currentUser?.organisation_id && currentUser?.document_permissions?.['invoice.override']);
    const canBulkExport = !currentUser?.isGuestUser;

    const options = canBulkExport
      ? [
          {
            label: `Export ${selectedItemIds.length} ${viewType}`,
            value: 'export',
            onClick: exportBulk
          }
        ]
      : [];

    if (!isInvoice && canUpdateDocument) {
      options.push({
        label: `Change category of ${selectedItemIds.length} documents`,
        value: 'change_documents_category',
        onClick: updateBulk
      });
      options.push({
        label: `Change name of ${selectedItemIds.length} documents`,
        value: 'change_names',
        onClick: renameBulk
      });
    }

    if (isInvoice) {
      options.push({
        label: `Approve ${selectedItemIds.length} ${viewType}`,
        value: 'approve_invoices',
        onClick: bulkApproveInvoices
      });
    }

    if (isInvoice) {
      options.push({
        label: `Remind Action Users of ${selectedItemIds.length} documents`,
        value: 'remind_invoice_action_users',
        onClick: showBulkRemindActionUsersModal
      });
      options.push({
        label: `Add priority to ${selectedItemIds.length} invoices`,
        value: 'add_priority',
        onClick: () => bulkChangeInvoicePriority(true)
      });
      options.push({
        label: `Remove priority from ${selectedItemIds.length} invoices`,
        value: 'remove_priority',
        onClick: () => bulkChangeInvoicePriority(false)
      });
    }

    if (isInvoice && canDeleteInvoice) {
      options.push({
        label: `Delete ${selectedItemIds.length} invoices`,
        value: 'delete_invoices',
        onClick: deleteBulk
      });
    }

    if (!isInvoice && canDeleteDocument) {
      options.push({
        label: `Delete ${selectedItemIds.length} documents`,
        value: 'delete_documents',
        onClick: deleteBulk
      });
    }

    return options;
  };

  const showBulkRemindActionUsersModal = async () => {
    const currentlyWithUser = selectedItems
      ?.map((item) => item.currently_with_user_details)
      ?.flat();
    dispatch(
      modalActions.showModal('REMIND_ACTION_USER', {
        bulkRemind: true,
        currentlyWithUser: currentlyWithUser?.map((user) => userOptionObj(user)),
        selectedItems
      })
    );
  };

  return (
    <div className='bulk-actions-bar'>
      <div className='bulk-actions-bar--left'>
        <button
          type='button'
          className='icon icon-cross-red bulk-actions-bar__clear-button'
          onClick={() => {
            setAllSelected(false);
            setSelectedItemIds([]);
          }}
        />
        <strong>{selectedItemIds.length} items selected</strong>
      </div>

      <div className='bulk-actions-bar--right'>
        <MyDropdown
          dropdownProps={{
            dropdownClassName: 'bulk-actions-button',
            dropdownText: 'Bulk Actions',
            showChevronDown: true
          }}
          selectProps={{ styles: selectStyles, options: bulkDropdownOptions() }}
        />
      </div>
    </div>
  );
};

export default connect((state) => state.dms)(BulkActionBar);
