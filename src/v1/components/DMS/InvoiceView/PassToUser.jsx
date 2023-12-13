import React, { useEffect, useMemo, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Form, reduxForm, autofill } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';
import { axiosInstance, userOptionObj } from '../../../../utils';
import { flashActions } from '../../../../actions';
import { Fields } from '../../Form';
import RecurringRuleTooltip from './RecurringRuleTooltip';
import { DropdownButton } from '../../index';

import './PassToUser.module.scss';

const PassToUserForm = ({
  submitFailed,
  handleSubmit,
  closeModal,
  setKeepDropdownOpen,
  currentUser,
  id,
  internalApprovers,
  inProcess,
  passBack,
  status,
  spNumber,
  reloadInvoice,
  isWithCurrentUser,
  nextInvoice,
  nextInvoiceStrataPlan,
  isInvoiceOverrider,
  setProcessing,
  processing,
  handleGoToNextInvoice,
  currentInvoice,
  handleGoToFirstInvoice,
  handleGoToLastInvoice,
  canGoToFirstAndLastInvoices
}) => {
  const [excludedUsers, setExcludedUsers] = useState([]);
  const [possiblePassUsers, setPossiblePassUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextApprover, setNextApprover] = useState();
  const [isInternalApprover, setIsInternalApprover] = useState(false);
  const formState = useSelector((state) => state.form.passToUser);
  const dispatch = useDispatch();
  const { values, syncErrors } = formState;
  const buildingProfileState = useSelector((state) => state.buildingProfile);
  const { available_balance: availableCash, funds_reserve: reserveFund } =
    buildingProfileState.building;
  const invoiceAmount = parseFloat(currentInvoice?.invoice?.invoiced_price ?? 0);
  const recurringRules = currentInvoice?.invoice?.applicable_recurring_rules || [];

  const showInsufficientFundsWarning = useMemo(() => {
    if (!currentUser?.isTenantManager) return false;

    const availableBalance = parseFloat(availableCash ?? 0) - parseFloat(reserveFund ?? 0);
    return (invoiceAmount >= 0 && availableBalance < invoiceAmount) || availableBalance < 0;
  }, [availableCash, reserveFund, invoiceAmount, currentUser]);

  const internalHasApproved = internalApprovers.find(
    (user) => user.id === currentUser.id && user.approved_invoices.includes(id)
  );

  const excludeField = [
    {
      name: 'excludeUsers',
      label: 'Select a user(s) to exclude from approving',
      component: 'react-select',
      userList: true,
      isMulti: true,
      options: excludedUsers ? excludedUsers.map(userOptionObj) : [],
      inProcess
    }
  ];

  const passField = [
    {
      name: 'passTo',
      label: 'Pass to a user',
      component: 'react-select',
      userList: true,
      isMulti: false,
      options: possiblePassUsers ? possiblePassUsers.map(userOptionObj) : [],
      inProcess
    }
  ];

  const statusField = [
    {
      name: 'note',
      component: 'input',
      type: 'textarea',
      label: 'Please enter a note:',
      placeholder: 'Write your note...'
    }
  ];

  useEffect(() => {
    if (nextApprover && nextApprover.id) {
      dispatch(autofill('passToUser', 'passTo', nextApprover));
      setLoading(false);
    }
  }, [nextApprover]);

  useEffect(() => {
    if (inProcess) {
      addFieldToUser();
    } else {
      setLoading(false);
    }
  }, [excludedUsers]);

  useEffect(() => {
    // const approvers = [...internalApprovers, ...externalApprovers];
    const checkInternalApprover = internalApprovers.filter(
      (approver) => approver.id === currentUser.id
    );
    if (checkInternalApprover.length >= 1) {
      setIsInternalApprover(true);
    }
    if (passBack) {
      // If not current approver and approver already approved current invoice, allow passback to approver
      setPossiblePassUsers(
        internalApprovers.filter(
          (user) => user.id !== currentUser.id && user.approved_invoices.includes(id)
        )
      );
    } else {
      // Set excluded list to approvers who have yet to approve
      setExcludedUsers(
        internalApprovers.filter(
          (user) => user.id !== currentUser.id && !user.approved_invoices.includes(id)
        )
      );
    }
  }, []);

  useEffect(() => {
    checkAvailableUsers();
  }, [values.excludeUsers]);

  const nextToApprove = () => {
    const notApproved = excludedUsers.filter(
      (approver) => !approver.approved_invoices.includes(id)
    );
    if (notApproved.length === 0) {
      setLoading(false);
      return null;
    }
    setNextApprover(userOptionObj(notApproved[0]));
  };

  const checkAvailableUsers = () => {
    const { excludeUsers } = values;
    if (excludedUsers && excludedUsers.length >= 1) {
      if (excludeUsers) {
        const difference = excludedUsers.filter(
          (user1) => !excludeUsers.some((user2) => user2.id === user1.id)
        );
        setPossiblePassUsers(difference);
      } else {
        setPossiblePassUsers(
          internalApprovers.filter(
            (user) => user.id !== currentUser.id && !user.approved_invoices.includes(id)
          )
        );
      }
      checkNextApproverExcluded();
    }
  };

  const checkNextApproverExcluded = () => {
    if (excludedUsers.length && values.passTo) {
      const isExcluded = excludedUsers.filter((user) => user.id === values.passTo.id);
      if (isExcluded.length >= 1) {
        dispatch(autofill('passToUser', 'passTo', null));
      }
    }
  };

  const addFieldToUser = () => {
    if (inProcess) {
      const newUsers = excludedUsers;
      newUsers.map((user) => {
        if (user.approved_invoices.includes(id)) {
          user.approved = 'true';
        }
        user.inProcess = 'true';
        return newUsers;
      });
      setPossiblePassUsers(newUsers);
      nextToApprove();
    }
  };

  const onSubmit = async ({ goToNext, isStrataPlan, isFirst, isLast }) => {
    try {
      setProcessing(true);
      closeModal();
      setKeepDropdownOpen(false);

      const statusNote = values.note;
      if (passBack) {
        await axiosInstance.put(
          `/v1/documents/${id}/assign_to_user?user_id=${values.passTo.id}${
            statusNote ? `&status_note=${statusNote}` : ''
          }`
        );
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
        return;
      }

      // Not pass back

      if (status === 'on_hold') {
        await axiosInstance.put(`/v1/documents/${id}?invoice_attributes[status]=under_review`);
      }

      await axiosInstance
        .put(`v1/documents/${id}/invoice/approve`, { status_note: statusNote })
        .then(async () => {
          await axiosInstance.put(
            `/v1/documents/${id}/assign_to_user?user_id=${values.passTo.id}${
              statusNote ? `&status_note=${statusNote}` : ''
            }`
          );

          if (values.excludeUsers) {
            await Promise.all(
              values.excludeUsers.map(async (excludedUser) => {
                await axiosInstance.put(
                  `/v1/building_profile/${encodeURIComponent(
                    spNumber
                  )}/approver_status?invoice_id=${id}&user_id=${excludedUser.value}&approved=true`
                );
              })
            );
          }

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
      setProcessing(false);
      dispatch(flashActions.showError(res));
    }
  };

  const approveAndGoToNext = () => {
    onSubmit({ goToNext: true, isStrataPlan: false });
  };

  const approveAndGoToNextStrataPlanInvoice = () => {
    onSubmit({ goToNext: true, isStrataPlan: true });
  };

  const approveAndGoToFirst = () => {
    onSubmit({ goToNext: true, isFirst: true });
  };

  const approveAndGoToLast = () => {
    onSubmit({ goToNext: true, isLast: true });
  };

  const handleOverrideClicked = async () => {
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
          .put(`v1/documents/${id}/invoice/override`, { note: values.note })
          .then(() => {
            dispatch(flashActions.showSuccess('You have approved for payment'));
            setProcessing(false);
            reloadInvoice();
          })
          .catch((error) => {
            dispatch(flashActions.showError(error));
            setProcessing(false);
          });
      }
    });
  };

  if (!loading) {
    return (
      <>
        {internalHasApproved && !isWithCurrentUser && status !== 'on_hold' && isInvoiceOverrider ? (
          <div className='override-container'>
            <h3 className='override-title'>Override & Approve</h3>
            {showInsufficientFundsWarning && (
              <div className='alert alert--warning'>
                <strong>WARNING:</strong>
                <ul>
                  <li style={{ listStyle: 'inside' }}>
                    This invoice will be placed On Hold due to insufficient funds (includes any
                    Reserve Funds in place for the Building)
                  </li>
                  <li style={{ listStyle: 'inside' }}>
                    An invoice that is scheduled for payment will only reflect as a liability on
                    Strata Master financial statements or status certificates once the invoice is
                    approved by all required approvers and the scheduled date is passed.
                  </li>
                </ul>
              </div>
            )}
            <div className='submit-buttons-container'>
              <button
                type='button'
                className='button override-approve-button'
                onClick={() => handleOverrideClicked()}
              >
                Override & Approve
              </button>
            </div>
          </div>
        ) : (
          <div className='pass-to-user-container'>
            <h3 className='pass-to-user-title'>Pass {passBack && 'back '}to user</h3>
            {!passBack && isInternalApprover && inProcess && (
              <RecurringRuleTooltip rules={recurringRules} />
            )}
            {showInsufficientFundsWarning && (
              <div className='alert alert--warning'>
                <strong>WARNING:</strong>
                <ul>
                  <li style={{ listStyle: 'inside' }}>
                    This invoice will be placed On Hold due to insufficient funds (includes any
                    Reserve Funds in place for the Building)
                  </li>
                  <li style={{ listStyle: 'inside' }}>
                    An invoice that is scheduled for payment will only reflect as a liability on
                    Strata Master financial statements or status certificates once the invoice is
                    approved by all required approvers and the scheduled date is passed.
                  </li>
                </ul>
              </div>
            )}
            <Form onSubmit={handleSubmit(onSubmit)} className='pass-to-user-form'>
              <div className='pass-user-fields-container'>
                {!passBack ? (
                  <>
                    <Fields
                      fields={excludeField}
                      values={values}
                      submitFailed={submitFailed}
                      syncErrors={syncErrors}
                    />
                    <div className='warning-message-container'>
                      <strong
                        className={`exclude-warning-text ${
                          values.excludeUsers ? 'active' : 'inactive'
                        }`}
                      >
                        This will skip selected users from the approval process!
                      </strong>
                    </div>
                  </>
                ) : null}
                <Fields
                  fields={passField}
                  values={values}
                  submitFailed={submitFailed}
                  syncErrors={syncErrors}
                />
                <div className='note-field'>
                  <Fields
                    fields={statusField}
                    values={values}
                    submitFailed={submitFailed}
                    syncErrors={syncErrors}
                  />
                </div>
              </div>

              <div className='submit-buttons-container'>
                <button
                  type='submit'
                  className='button pass-to-user-button'
                  disabled={!values.passTo || processing}
                >
                  Pass {passBack && 'back '}to user
                </button>
                {nextInvoice && (
                  <DropdownButton
                    className='pass-to-user-button-next-invoice'
                    onClickHandler={approveAndGoToNext}
                    disabled={processing}
                    text={`Pass ${passBack ? 'back ' : ''}to user & go to next Invoice`}
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
                )}
                {!passBack &&
                isInternalApprover &&
                inProcess &&
                (isInvoiceOverrider || recurringRules.length > 0) ? (
                  <button
                    type='button'
                    className='button override-approve-button'
                    onClick={() => handleOverrideClicked()}
                    disabled={processing}
                  >
                    Override & Approve
                  </button>
                ) : null}
              </div>
            </Form>
          </div>
        )}
      </>
    );
  }

  return null;
};

const validate = (values) => {
  const errors = {};
  if (!values.passTo) errors.passTo = 'Please select a user';
  return errors;
};

export const PassToUser = reduxForm({
  form: 'passToUser',
  destroyOnUnmount: true,
  initialValues: {},
  validate
})(PassToUserForm);
