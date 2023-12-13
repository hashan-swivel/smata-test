import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { axiosInstance } from '../../../../utils';
import { ActionForm } from './ActionForm';
import { flashActions } from '../../../../actions';
import RecurringRuleTooltip from './RecurringRuleTooltip';
import { DropdownButton } from '../../index';

import './CancelHoldInvoice.module.scss';

const ApproveInvoiceForm = ({
  submitFailed,
  handleSubmit,
  closeModal,
  documentName,
  id,
  currentInvoice,
  currentUser,
  reloadInvoice,
  nextInvoice,
  nextInvoiceStrataPlan,
  setProcessing,
  processing,
  handleGoToNextInvoice,
  handleGoToFirstInvoice,
  handleGoToLastInvoice,
  canGoToFirstAndLastInvoices,
  isInvoiceOverrider
}) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.approveInvoice);
  const { values, syncErrors } = formState;
  const buildingProfileState = useSelector((state) => state.buildingProfile);
  const { available_balance: availableCash, funds_reserve: reserveFund } =
    buildingProfileState.building;
  const invoiceAmount = parseFloat(currentInvoice?.invoice?.invoiced_price ?? 0);
  const recurringRules = currentInvoice.invoice?.applicable_recurring_rules || [];

  const showInsufficientFundsWarning = useMemo(() => {
    if (!currentUser?.isTenantManager) return false;

    const availableBalance = parseFloat(availableCash ?? 0) - parseFloat(reserveFund ?? 0);
    return (invoiceAmount >= 0 && availableBalance < invoiceAmount) || availableBalance < 0;
  }, [availableCash, reserveFund, invoiceAmount]);

  const statusField = [
    {
      name: 'note',
      component: 'input',
      type: 'textarea',
      label: 'Please enter a note for approval:',
      placeholder: 'Write your note...'
    }
  ];

  const approveForPayment = async ({ goToNext, isStrataPlan, isFirst, isLast }) => {
    setProcessing(true);
    closeModal();

    const statusNote = values && values.note ? values.note : '';
    try {
      await axiosInstance
        .put(`v1/documents/${id}/invoice/approve`, { status_note: statusNote })
        .then(async () => {
          setProcessing(false);

          if (goToNext) {
            if (isFirst) {
              handleGoToFirstInvoice();
            } else if (isLast) {
              handleGoToLastInvoice();
            } else {
              handleGoToNextInvoice(isStrataPlan);
            }
          } else {
            reloadInvoice();
          }
        });
    } catch (res) {
      dispatch(flashActions.showError(res));
      setProcessing(false);
    }
  };

  const overrideApprove = async ({ goToNext, isStrataPlan }) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: 'Are you sure?',
      text: 'This invoice will not be sent to any Internal or External Approvers',
      confirmButtonText: 'OVERRIDE & APPROVE',
      showCancelButton: true,
      customClass: {
        title: 'swal2-title text--left',
        htmlContainer: 'swal2-html-container text--left',
        confirmButton: 'button button--danger',
        cancelButton: 'button button--secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        closeModal();
        setProcessing(true);

        axiosInstance
          .put(`v1/documents/${id}/invoice/override`)
          .then(() => {
            dispatch(flashActions.showSuccess('You have approved for payment'));
            setProcessing(false);
            goToNext === true ? handleGoToNextInvoice(isStrataPlan) : reloadInvoice(true);
          })
          .catch((error) => {
            dispatch(flashActions.showError(error));
            setProcessing(false);
          });
      }
    });
  };

  const approveAndGoToNext = () => {
    approveForPayment({ goToNext: true, isStrataPlan: false });
  };

  const approveAndGoToNextStrataPlanInvoice = () => {
    approveForPayment({ goToNext: true, isStrataPlan: true });
  };

  const approveAndGoToFirst = () => {
    approveForPayment({ goToNext: true, isFirst: true });
  };

  const approveAndGoToLast = () => {
    approveForPayment({ goToNext: true, isLast: true });
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>Approve invoice?</h3>
      {currentUser?.isTenantManager && <RecurringRuleTooltip rules={recurringRules} />}

      {showInsufficientFundsWarning && (
        <div className='alert alert--warning'>
          <strong>WARNING:</strong>
          &nbsp;This invoice will be placed On Hold due to insufficient funds (includes any Reserve
          Funds in place for the Building)
        </div>
      )}

      <p className='approve-warning-text'>Approving this invoice will send it for payment.</p>
      <p className='cancel-hold-invoice-text'>Are you sure you want approve {documentName}?</p>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={approveForPayment}
        field={statusField}
        closeModal={closeModal}
        buttonText='Approve'
        actionButtonColor='green'
      />
      {nextInvoice && (
        <div className='cancel-hold-invoice-buttons-container'>
          <DropdownButton
            className='secondary approve-go-to-next-button'
            onClickHandler={approveAndGoToNext}
            disabled={processing}
            text='Approve & go to next Invoice'
          >
            <button
              disabled={!canGoToFirstAndLastInvoices}
              type='button'
              onClick={approveAndGoToFirst}
            >
              First Invoice in Tasks
            </button>
            <button
              disabled={!canGoToFirstAndLastInvoices}
              type='button'
              onClick={approveAndGoToLast}
            >
              Last Invoice in Tasks
            </button>
            <button
              disabled={!nextInvoiceStrataPlan || processing}
              type='button'
              onClick={approveAndGoToNextStrataPlanInvoice}
            >
              Same Plan Number
            </button>
          </DropdownButton>
        </div>
      )}

      {currentUser?.isTenantManager && (recurringRules.length > 0 || isInvoiceOverrider) && (
        <div className='cancel-hold-invoice-buttons-container'>
          <button
            type='button'
            className='button override-approve-button'
            onClick={() => {
              overrideApprove({});
            }}
            disabled={processing}
          >
            Override & Approve
          </button>
        </div>
      )}
    </div>
  );
};

export const ApproveInvoice = reduxForm({
  form: 'approveInvoice',
  destroyOnUnmount: true,
  initialValues: {}
})(ApproveInvoiceForm);
