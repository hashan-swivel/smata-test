import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { axiosInstance } from '../../../../utils';
import { flashActions } from '../../../../actions';
import { Avatar } from '../../Avatar';
import RecurringRuleTooltip from './RecurringRuleTooltip';
import { DropdownButton } from '../../index';

import './CancelHoldInvoice.module.scss';

export const SendToExternal = ({
  closeModal,
  documentName,
  id,
  externalApprovers,
  reloadInvoice,
  status,
  externalRequired,
  nextInvoice,
  nextInvoiceStrataPlan,
  isInvoiceOverrider,
  setProcessing,
  processing,
  handleGoToNextInvoice,
  handleGoToFirstInvoice,
  handleGoToLastInvoice,
  currentInvoice,
  currentUser,
  canGoToFirstAndLastInvoices
}) => {
  const dispatch = useDispatch();

  const buildingProfileState = useSelector((state) => state.buildingProfile);
  const { available_balance: availableCash, funds_reserve: reserveFund } =
    buildingProfileState.building;
  const invoiceAmount = parseFloat(currentInvoice.invoice?.invoiced_price ?? 0);
  const recurringRules = currentInvoice.invoice?.applicable_recurring_rules || [];
  const [note, setNote] = useState('');

  const showInsufficientFundsWarning = useMemo(() => {
    if (!currentUser?.isTenantManager) return false;

    const availableBalance = parseFloat(availableCash ?? 0) - parseFloat(reserveFund ?? 0);
    return (invoiceAmount >= 0 && availableBalance < invoiceAmount) || availableBalance < 0;
  }, [availableCash, reserveFund, invoiceAmount]);

  const approveForPayment = async ({ goToNext, isStrataPlan, isFirst, isLast }) => {
    try {
      closeModal();
      setProcessing(true);
      await axiosInstance.put(`v1/documents/${id}/invoice/approve`).then(async () => {
        if (status === 'new' || status === 'on_hold') {
          await axiosInstance.put(`/v1/documents/${id}?invoice_attributes[status]=under_review`);
        }

        await axiosInstance.put(`/v1/documents/${id}/assign_to_all_users`, {
          external_approvers: 'true',
          status_note: note
        });
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
      reloadInvoice();
    }
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

  const overrideAndGoToNext = () => {
    overrideApprove({ goToNext: true, isStrataPlan: false });
  };

  const overrideAndGoToNextStrataPlanInvoice = () => {
    overrideApprove({ goToNext: true, isStrataPlan: true });
  };

  const overrideAndGoToFirst = () => {
    overrideApprove({ goToNext: true, isFirst: true });
  };

  const overrideAndGoToLast = () => {
    overrideApprove({ goToNext: true, isLast: true });
  };

  const overrideApprove = async ({ goToNext, isStrataPlan, isFirst, isLast }) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: 'Are you sure?',
      html:
        '<div class="alert alert--warning">' +
        '<strong>WARNING:</strong>' +
        '<ul style="list-style-type: square">' +
        `${
          showInsufficientFundsWarning
            ? '<li style="list-style: inside">This invoice will be placed On Hold due to insufficient funds (includes any Reserve Funds in place for the Building)</li>'
            : ''
        }` +
        '<li style="list-style: inside">This invoice will not be sent to any Internal or External Approvers.</li>' +
        '</ul>' +
        '</div>',
      confirmButtonText: 'OVERRIDE & APPROVE',
      input: 'text',
      inputPlaceholder: 'Add a note (optional)',
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
          .put(`v1/documents/${id}/invoice/override`, { note: result?.value })
          .then(() => {
            dispatch(flashActions.showSuccess('You have approved for payment'));
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
          })
          .catch((error) => {
            dispatch(flashActions.showError(error));
            setProcessing(false);
          });
      }
    });
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>Approve invoice and send to external approvers?</h3>
      {currentUser?.isTenantManager && <RecurringRuleTooltip rules={recurringRules} />}

      {showInsufficientFundsWarning && (
        <div className='alert alert--warning' style={{ marginBottom: '10px' }}>
          <strong>WARNING:</strong>
          &nbsp;This invoice will be placed On Hold due to insufficient funds (includes any Reserve
          Funds in place for the Building)
        </div>
      )}

      {externalApprovers.map((user, index) => (
        <div key={`avatar-${index}`}>
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            size='xsmall'
            showTooltip
            // eslint-disable-next-line react/no-array-index-key
            key={user.id}
          />
          {user.fullName}
        </div>
      ))}

      {externalRequired ? (
        <>
          <p className='approve-warning-text'>
            You will approve this invoice and send it to external approvers.
          </p>
          <p className='cancel-hold-invoice-text'>Are you sure you want approve {documentName}?</p>
        </>
      ) : (
        <>
          <p className='approve-warning-text text--danger'>
            The amount for {documentName} is under the limit necessary for external approvers.
          </p>
          <p className='cancel-hold-invoice-text text--danger'>
            You can continue to send to external approvers or choose to override and approve.
          </p>
        </>
      )}

      <div className='form__group'>
        <div className='form__control'>
          <label htmlFor='note'>Write a note</label>
        </div>
        <input
          className='form__control'
          type='text'
          placeholder='Write a note (optional)'
          onChange={(e) => setNote(e.target?.value)}
          value={note}
        />
      </div>

      <div className='cancel-hold-invoice-buttons-container'>
        <button type='button' className='button go-back-button' onClick={() => closeModal()}>
          Close
        </button>
        <button
          type='button'
          className='button secondary on-hold-button'
          onClick={() => {
            approveForPayment({});
          }}
          disabled={processing}
        >
          Approve
        </button>
      </div>

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

      {(!externalRequired ||
        isInvoiceOverrider ||
        (currentUser?.isTenantManager && recurringRules.length > 0)) && (
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
      {nextInvoice &&
        (!externalRequired ||
          isInvoiceOverrider ||
          (currentUser?.isTenantManager && recurringRules.length > 0)) && (
          <div className='cancel-hold-invoice-buttons-container'>
            <DropdownButton
              className='override-goto-next-button'
              onClickHandler={overrideAndGoToNext}
              disabled={processing}
              text='Override & go to next invoice'
            >
              <button
                disabled={!canGoToFirstAndLastInvoices}
                type='button'
                onClick={overrideAndGoToFirst}
              >
                First Invoice in Tasks
              </button>
              <button
                disabled={!canGoToFirstAndLastInvoices}
                type='button'
                onClick={overrideAndGoToLast}
              >
                Last Invoice in Tasks
              </button>
              <button
                disabled={!nextInvoiceStrataPlan || processing}
                type='button'
                onClick={overrideAndGoToNextStrataPlanInvoice}
              >
                Same Plan Number
              </button>
            </DropdownButton>
          </div>
        )}
    </div>
  );
};
