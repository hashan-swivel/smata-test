import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { documentActions, modalActions } from '../../../../actions';
import { invoiceConstants } from '../../../../constants';
import { MyDropdown } from '../../MyDropdown';
import Router from 'next/router';

const selectStyles = {
  control: (provided) => ({
    ...provided,
    display: 'none'
  }),
  option: (styles, { data }) => {
    return {
      ...styles,
      color:
        data?.value === 'cancel_invoice' ||
        data?.value === 'delete_invoice' ||
        data?.value === 'delete_document'
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

export const HeaderDropdown = ({
  canVote,
  currentUser,
  firstApprover,
  invoiceStatus,
  showModalType,
  invoice,
  id,
  jobId,
  showBuildingRule,
  isInternalApprover,
  contractor,
  canAddApprovalOptions,
  currentlyWithUser,
  spNumber,
  invoicePriority,
  buildingData
}) => {
  const canAction =
    currentUser?.isSystemManager || currentUser?.isOrganisationAdmin || isInternalApprover;
  const isDeleted = invoiceStatus === 'deleted';
  const isProcessing = invoiceStatus === 'processing';
  const isPaid = invoiceStatus === 'paid';
  const isPaymentScheduled = invoiceStatus === 'payment_scheduled';
  const isNoPaymentRequired = invoiceStatus === 'no_payment_required';
  const isHold = invoiceStatus === 'on_hold';
  const isImported = invoiceStatus === 'imported';
  const isCancelled = invoiceStatus === 'cancelled';

  const notProcessingPayment = !isProcessing && !isPaid && !isNoPaymentRequired;
  const isFirstApprover = currentUser.id === firstApprover?.id;
  const isScheduled = useMemo(
    () => invoiceConstants.SCHEDULED_STATUSES.includes(invoiceStatus),
    [invoiceStatus]
  );

  const canHold = invoice && !isHold && notProcessingPayment && !isScheduled && !isImported;
  const canRelease = invoice && isHold;
  const canRequirePayment = invoice && isNoPaymentRequired;
  const canReject = invoice && jobId && notProcessingPayment && !isScheduled && !isImported;
  const canCancel = invoice && !isCancelled && notProcessingPayment && !isImported;
  const canReopen = invoice && isCancelled;
  const canDelete = !isDeleted && notProcessingPayment;
  const canDeleteInvoice =
    invoice &&
    canDelete &&
    (currentUser?.isSystemManager || currentUser?.document_permissions?.['invoice.delete']) &&
    !isScheduled;
  const canDeleteDocument =
    !invoice &&
    canDelete &&
    (currentUser?.isSystemManager || currentUser?.document_permissions?.['document.delete']);
  const canApproveNoPayment =
    contractor && notProcessingPayment && invoice && !isScheduled && !isImported;
  const canSchedulePaymentDate =
    notProcessingPayment && !isImported && !currentUser?.feature_flags?.invoice_transaction_date;
  const canUpdateBuildRule =
    (currentUser?.isOrganisationAdmin || currentUser?.isStrataManager) &&
    !isScheduled &&
    !isImported;
  // If is internal approver and not first approver and has not voted
  const canPassBack = useMemo(
    () => !isFirstApprover && canVote && !isScheduled,
    [firstApprover, currentUser.id, canVote, isScheduled]
  );
  const dispatch = useDispatch();

  const showRemindActionUserModal = () => {
    dispatch(
      modalActions.showModal('REMIND_ACTION_USER', {
        docId: id,
        currentlyWithUser,
        isInvoicePage: true
      })
    );
  };

  const showDuplicateInvoiceModal = () => {
    dispatch(
      modalActions.showModal('DUPLICATE_INVOICE', { duplicatedDocumentId: invoice?.duplicate, id })
    );
  };

  const dropdownOptions = () => {
    const options = [];

    if (canHold && canAction) {
      options.push({
        label: 'Place On Hold',
        value: 'place_on_hold',
        onClick: () => showModalType('on-hold')
      });
    }

    if (canRelease && canAction) {
      options.push({
        label: 'Take Off Hold',
        value: 'take_off_hold',
        onClick: () => showModalType('take-off-hold')
      });
    }

    if (canAddApprovalOptions && canSchedulePaymentDate && canAction) {
      options.push({
        label: `${isPaymentScheduled ? 'Update' : 'Schedule'} Payment Date`,
        value: 'schedule_payment',
        onClick: () => showModalType('schedule-payment')
      });
    }

    if (canApproveNoPayment && canAction) {
      options.push({
        label: 'No Payment Required',
        value: 'no_payment_required',
        onClick: () => showModalType('no-payment-required')
      });
    }

    if (canRequirePayment && canAction) {
      options.push({
        label: 'Require Payment',
        value: 'payment_required',
        onClick: () => showModalType('require-payment')
      });
    }

    if (canPassBack) {
      options.push({
        label: 'Pass Back To User',
        value: 'pass',
        onClick: () => showModalType('pass')
      });
    }

    if (showBuildingRule && buildingData?.can_view_building_rule) {
      options.push({
        label: 'Building Rules',
        value: 'building_rules',
        onClick: () => showModalType('building-rules')
      });
    }

    if (canUpdateBuildRule) {
      options.push({
        label: 'Update Building Rules',
        value: 'update_building_rules',
        onClick: () =>
          Router.push({ pathname: '/building-profile', query: { id: spNumber, rule_modal: true } })
      });
    }

    if (invoice && canAction && !isScheduled) {
      options.push({
        label: 'Duplicate Invoices',
        value: 'duplicate_invoices',
        onClick: showDuplicateInvoiceModal
      });
    }

    if (canReopen) {
      options.push({
        label: 'Reopen Invoice',
        value: 'reopen_invoice',
        onClick: () => showModalType('reopen')
      });
    }

    if (invoice && !isScheduled && canAction && !isImported) {
      options.push({
        label: `${invoicePriority ? 'Remove' : 'Mark'} Priority`,
        value: 'toggle_priority',
        onClick: () => showModalType('priority')
      });
    }

    if (invoice && currentlyWithUser && canAction && !isScheduled && !isImported) {
      options.push({
        label: 'Remind Action Users',
        value: 'remind_action_users',
        onClick: showRemindActionUserModal
      });
    }

    if (canReject && canAction) {
      options.push({
        label: 'Reject Invoice',
        value: 'reject_invoice',
        onClick: () => showModalType('reject')
      });
    }

    if (canCancel && canAction) {
      options.push({
        label: 'Cancel Invoice',
        value: 'cancel_invoice',
        onClick: () => showModalType('cancel')
      });
    }

    if (canDeleteInvoice) {
      options.push({
        label: 'Delete Invoice',
        value: 'delete_invoice',
        onClick: () =>
          dispatch(
            documentActions.deleteDocument(id, () =>
              setTimeout(() => Router.push('/documents'), 1100)
            )
          )
      });
    }

    if (canDeleteDocument) {
      options.push({
        label: 'Delete Document',
        value: 'delete_document',
        onClick: () =>
          dispatch(
            documentActions.deleteDocument(id, () =>
              setTimeout(() => Router.push('/documents'), 1100)
            )
          )
      });
    }

    return options;
  };

  if (dropdownOptions().length < 1) return null;

  return (
    <MyDropdown
      dropdownProps={{ dropdownText: '...', dropdownClassName: 'dropdown-button' }}
      selectProps={{ options: dropdownOptions(), styles: selectStyles }}
    />
  );
};
