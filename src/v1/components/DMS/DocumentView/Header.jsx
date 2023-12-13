import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { autofill } from 'redux-form';
import Router from 'next/router';
import {
  faBuilding,
  faDollarSign,
  faExclamationTriangle,
  faUser,
  faWrench,
  faDoorOpen,
  faMoneyBillWave,
  faStamp,
  faInfoCircle,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tippy';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  addLabelValues,
  isManager,
  isAdminOrSupport,
  isOrganisationAdmin,
  isMember,
  axiosInstance,
  currencyFormat
} from '../../../../utils';
import {
  addAttachment,
  flashActions,
  getLotNumbers,
  getProfile,
  modalActions
} from '../../../../actions';
import { Breadcrumbs, FileType, Link } from '../../index';
import { Fields } from '../../Form';
import { HeaderDropdown } from './HeaderDropdown';
import Accordion from '../InvoiceView/Accordion';
import invoiceStatusText from '../helpers/invoiceStatusText';
import { datetimeConstants, invoiceConstants } from '../../../../constants';

import './Header.module.scss';

export const Header = (props) => {
  const {
    id,
    name,
    invoice,
    openModal,
    keepDropdownOpen,
    setKeepDropdownOpen,
    setModalType,
    status,
    extractionStatus,
    canVote,
    hasVoted,
    strataManager,
    approvalAmount,
    internalApprovers,
    externalApprovers,
    holdApprovers,
    internalApproved,
    currentUser,
    buildingData,
    firstApprover,
    filename,
    exportedToStrataMaster,
    job,
    isWithCurrentUser,
    sharedWith,
    isUnchangeableSourceType,
    isInvoiceOverrider,
    editing,
    showBuildingRule,
    isInternalApprover,
    contractor,
    canAddApprovalOptions,
    currentlyWithUser,
    processing,
    setProcessing,
    invoicePriority,
    deleted,
    complianceValid
  } = props;
  const invoiceStatus = invoiceStatusText(status, exportedToStrataMaster, extractionStatus);
  const dispatch = useDispatch();
  const buildingProfileState = useSelector((state) => state.buildingProfile);
  const { available_balance: availableCash, funds_reserve: reserveFund } =
    buildingProfileState.building;
  const invoiceAmount = parseFloat(invoice?.invoiced_price ?? 0);

  const showInsufficientFundsWarning = useMemo(() => {
    if (!currentUser?.isTenantManager) return false;

    const availableBalance = parseFloat(availableCash ?? 0) - parseFloat(reserveFund ?? 0);
    return (invoiceAmount >= 0 && availableBalance < invoiceAmount) || availableBalance < 0;
  }, [availableCash, reserveFund, invoiceAmount]);

  const isExternal = useMemo(
    () =>
      externalApprovers?.length > 0
        ? externalApprovers.some((user) => user?.id === currentUser.id)
        : false,
    [externalApprovers]
  );

  const isStrataManager = useMemo(
    () => currentUser.id === strataManager?.id,
    [currentUser.id, strataManager?.id]
  );
  const isOnHold = useMemo(() => status === 'on_hold', [status]);
  const isOffHold = useMemo(() => !isOnHold, [isOnHold]);
  const jobId = job?.id;
  const showSetupInvoiceRule =
    (currentUser?.isStrataManager || currentUser?.isOrganisationAdmin) &&
    (!buildingData?.building_rules ||
      buildingData?.building_rules?.one_off_invoices?.approvers?.length === 0);

  useEffect(() => {
    const isInvoice = !!invoice;
    if (buildingData?.site_plan_id) {
      if (!isInvoice) {
        dispatch(getProfile(buildingData.site_plan_id));
      }
      dispatch(getLotNumbers(buildingData.site_plan_id));
    }
  }, [buildingData]);

  const canTakeOffHold = useMemo(() => {
    if (isOnHold && !isStrataManager) {
      return holdApprovers.includes(currentUser.id);
    }

    return true;
  }, [currentUser, holdApprovers, isOnHold, isStrataManager]);

  // If the document is an invoice and the status isn't one within the noApproveStatus array
  const showApproveButtons = useMemo(
    () =>
      invoice &&
      Object.keys(buildingData).length > 0 &&
      !invoiceConstants.NON_APPROVABLE_STATUSES.includes(status.toLowerCase()) &&
      (canVote || hasVoted || canTakeOffHold || status === 'new') &&
      !editing &&
      !isUnchangeableSourceType,
    [buildingData, status, canVote, canTakeOffHold, hasVoted, editing]
  );

  // Show approve button for external approvers if condition met
  const showApproveByType = useMemo(
    () => !isExternal || (isExternal && internalApproved?.length >= internalApprovers?.length),
    [isExternal, internalApproved?.length, internalApprovers?.length]
  );

  // Check if the user is allowed to vote or if they are the strata manager or if the amount is under the amount set in building rules
  const hasVotePermission =
    (canVote ||
      isInvoiceOverrider ||
      isStrataManager ||
      isOrganisationAdmin(currentUser) ||
      (approvalAmount && invoice.invoiced_price && invoice.invoiced_price <= approvalAmount)) &&
    !exportedToStrataMaster &&
    status !== 'processing' &&
    status !== 'new' &&
    status !== 'checking_for_duplicates' &&
    showApproveByType;

  const showModalType = (modalType) => {
    if (modalType === 'pass' || modalType === 'schedule-payment' || modalType === 'approve') {
      if (
        !complianceValid &&
        currentUser?.isTenantManager &&
        (currentUser?.feature_flags?.compliance ||
          currentUser?.feature_flags?.strata_master_compliance)
      ) {
        let htmlText;
        let cancelButtonText;
        let showConfirmButton = false;

        if (currentUser?.feature_flags?.compliance) {
          htmlText =
            '<p style="text-align: center;">This Service Provider has invalid or missing compliance documentation.</p>' +
            '<p style="color: red; text-align: center;">Please assist by following up with the Service Provider to update their documentation.<br />' +
            '<a href="https://help.smata.com/hc/en-us/requests/new?ticket_form_id=5457408683535">Contact support</a> for help with Service Provider activation and compliance.</p>';
          cancelButtonText = 'CLOSE & SEND REMINDER';
          showConfirmButton = !currentUser?.feature_flags?.enforce_premium_compliance_for_invoice;
        }

        if (currentUser?.feature_flags?.strata_master_compliance) {
          htmlText =
            '<p style="color: red; text-align: center;">This Service Provider status in Strata Master is not compliant.</p>';
          cancelButtonText = 'CLOSE';
          showConfirmButton =
            !currentUser?.feature_flags?.enforce_strata_master_compliance_for_invoice;
        }

        const MySwal = withReactContent(Swal);

        MySwal.fire({
          icon: 'warning',
          title: 'Invalid Compliance',
          html: htmlText,
          showConfirmButton,
          confirmButtonText: 'PROCEED',
          showCancelButton: true,
          cancelButtonText,
          customClass: {
            title: 'swal2-title text--center',
            htmlContainer: 'swal2-html-container text--left',
            confirmButton: 'button button--danger',
            cancelButton: 'button button--secondary'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            setModalType(modalType);
            setKeepDropdownOpen(true);
            openModal();
          }
        });

        return;
      }
    }

    setModalType(modalType);
    setKeepDropdownOpen(true);
    openModal();
  };

  const messageUsers = () =>
    addLabelValues(
      sharedWith.filter((user) => user.id !== currentUser.id),
      true
    );

  const approveButton = () => {
    if (status === 'checking_for_duplicates') return;
    if (
      hasVoted &&
      isOffHold &&
      !isWithCurrentUser &&
      isInvoiceOverrider &&
      currentUser?.isTenantManager &&
      invoiceConstants.OVERRIDABLE_STATUES.includes(status)
    ) {
      return (
        <button
          type='button'
          className='override-approve-button button'
          onClick={() => handleOverrideClicked()}
          disabled={processing}
        >
          Override/Approve
        </button>
      );
    }

    if (!hasVoted && isWithCurrentUser) {
      return (
        <button
          type='button'
          className={`approve-invoice-button button primary ${
            isExternal ? 'external-approve' : ''
          }`}
          onClick={() => showModalType(isOnHold && !canTakeOffHold ? 'is-on-hold' : 'approve')}
          disabled={processing}
        >
          Approve{isOnHold && canTakeOffHold ? ' / Off Hold' : null}
        </button>
      );
    }

    if (
      currentUser?.isTenantManager &&
      currentUser?.canOverrideInvoice &&
      invoiceConstants.OVERRIDABLE_STATUES.includes(status)
    ) {
      return (
        <button
          type='button'
          className='override-approve-button button'
          onClick={() => handleOverrideClicked()}
          disabled={processing}
        >
          Override/Approve
        </button>
      );
    }
  };

  const handleOverrideClicked = () => {
    let title;
    let htmlText;
    let cancelButtonText;
    let showConfirmButton = false;

    if (
      !complianceValid &&
      currentUser?.isTenantManager &&
      (currentUser?.feature_flags?.compliance ||
        currentUser?.feature_flags?.strata_master_compliance)
    ) {
      title = 'Invalid Compliance';

      if (currentUser?.feature_flags?.compliance) {
        htmlText =
          '<p style="text-align: center;">This Service Provider has invalid or missing compliance documentation.</p>' +
          '<p style="color: red; text-align: center;">Please assist by following up with the Service Provider to update their documentation.<br />' +
          '<a href="https://help.smata.com/hc/en-us/requests/new?ticket_form_id=5457408683535">Contact support</a> for help with Service Provider activation and compliance.</p>';
        cancelButtonText = 'CLOSE & SEND REMINDER';
        showConfirmButton = !currentUser?.feature_flags?.enforce_premium_compliance_for_invoice;
      }

      if (currentUser?.feature_flags?.strata_master_compliance) {
        htmlText =
          '<p style="color: red; text-align: center;">This Service Provider in Strata Master is not compliant.</p>';
        cancelButtonText = 'CLOSE';
        showConfirmButton =
          !currentUser?.feature_flags?.enforce_strata_master_compliance_for_invoice;
      }
    } else {
      title = 'Are you sure?';
      htmlText =
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
        '</div>';
      cancelButtonText = 'CLOSE';
      showConfirmButton = true;
    }
    const MySwal = withReactContent(Swal);
    const swalConfig = {
      title,
      html: htmlText,
      showConfirmButton,
      confirmButtonText: 'OVERRIDE & APPROVE',
      showCancelButton: true,
      cancelButtonText,
      customClass: {
        title: 'swal2-title text--center',
        htmlContainer: 'swal2-html-container text--left',
        confirmButton: 'button button--danger',
        cancelButton: 'button button--secondary'
      }
    };

    if (showConfirmButton) {
      swalConfig.input = 'text';
      swalConfig.inputPlaceholder = 'Add a note (optional)';
    }

    MySwal.fire(swalConfig).then((result) => {
      if (result.isConfirmed) {
        setProcessing(true);

        axiosInstance
          .put(`v1/documents/${id}/invoice/override`, { note: result?.value })
          .then(() => {
            dispatch(flashActions.showSuccess('You have approved for payment'));
            setProcessing(false);
            Router.reload();
          })
          .catch((error) => {
            setProcessing(false);
            dispatch(flashActions.showError(error));
          });
      }
    });
  };

  const handleReExportInvoiceClick = () => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: 'Are you sure?',
      text: 'This invoice will be re-exported to Strata Master.',
      confirmButtonText: 'RE-EXPORT',
      showCancelButton: true,
      customClass: {
        title: 'swal2-title text--left',
        htmlContainer: 'swal2-html-container text--left',
        confirmButton: 'button button--danger',
        cancelButton: 'button button--secondary'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessing(true);

        axiosInstance
          .put(`v1/documents/${id}/invoice/re_export`)
          .then(() => {
            dispatch(flashActions.showSuccess('You have re-exported invoice successfully'));
            setProcessing(false);
            Router.reload();
          })
          .catch((error) => {
            setProcessing(false);
            dispatch(flashActions.showError(error));
          });
      }
    });
  };

  const reExportButton = () => {
    if (!invoice || currentUser?.isStrataMember) return null;
    if (!invoiceConstants.RE_EXPORTABLE_STATUSES.includes(status.toLowerCase())) return null;
    if (!invoice?.re_export_status || invoice?.re_export_status === 'not_available') return null;

    return (
      <button
        type='button'
        className='button button--primary button--re-export'
        onClick={() => handleReExportInvoiceClick()}
        disabled={processing || invoice?.re_export_status === 'not_ready'}
      >
        {processing || invoice?.re_export_status === 'not_ready' ? (
          <Tooltip
            arrow
            title='The system will attempt to re-export this invoice automatically for 3 attempts (4 hours). If still failed after 3 attempts you can manually attempt re-export. Refer to history log for details on retry attempts.'
            position='bottom'
            animation='fade'
            theme='light'
          >
            RE-EXPORT
          </Tooltip>
        ) : (
          'RE-EXPORT'
        )}
      </button>
    );
  };

  return (
    <div className='document-header'>
      <div className='invoice-header-container'>
        <Breadcrumbs
          breadcrumbs={[
            {
              label: invoice ? 'Invoices' : 'Documents',
              href: '/documents',
              query: { showInvoice: !!invoice }
            },
            { label: name }
          ]}
        />

        <div className='invoice-approve'>
          {showSetupInvoiceRule && (
            <Link
              classNameProp='setup-invoice-rule-button button danger'
              href='/src/pages/v1/building-profile'
              query={{ id: buildingData?.site_plan_id, rule_modal: true }}
              target='_blank'
            >
              ! Setup Invoice Rules
            </Link>
          )}
          {showApproveButtons && hasVotePermission && (
            <>
              {isExternal && (
                <Link
                  classNameProp='approve-invoice-button button primary external-approve'
                  href='/src/pages/v1/messages'
                  query={{ createMessage: true }}
                  onClick={() => {
                    dispatch(
                      addAttachment({
                        id,
                        spNumber: buildingData?.site_plan_id || null,
                        locations: buildingData?.locations || null,
                        filename,
                        category: 'invoice',
                        users: messageUsers(sharedWith)
                      })
                    );
                  }}
                >
                  Message
                </Link>
              )}
              {approveButton()}
            </>
          )}
          {reExportButton()}
          {invoice &&
            !isExternal &&
            !exportedToStrataMaster &&
            !editing &&
            !deleted &&
            !currentUser?.isBuildingInspector && (
              <HeaderDropdown
                showBuildingRule={showBuildingRule}
                canVote={canVote}
                currentUser={currentUser}
                firstApprover={firstApprover}
                invoiceStatus={status}
                keepDropdownOpen={keepDropdownOpen}
                setKeepDropdownOpen={setKeepDropdownOpen}
                showModalType={showModalType}
                invoice={invoice}
                id={id}
                jobId={jobId}
                isInternalApprover={isInternalApprover}
                contractor={contractor}
                canAddApprovalOptions={canAddApprovalOptions}
                currentlyWithUser={currentlyWithUser}
                setProcessing={setProcessing}
                spNumber={buildingData?.site_plan_id}
                invoicePriority={invoicePriority}
                buildingData={buildingData}
              />
            )}
          {!invoice &&
            showBuildingRule &&
            !editing &&
            !deleted &&
            !currentUser?.isBuildingInspector && (
              <HeaderDropdown
                showBuildingRule={showBuildingRule}
                currentUser={currentUser}
                keepDropdownOpen={keepDropdownOpen}
                setKeepDropdownOpen={setKeepDropdownOpen}
                showModalType={showModalType}
                id={id}
                jobId={jobId}
                contractor={contractor}
                invoice={invoice}
                invoiceStatus={status}
                firstApprover={firstApprover}
                isInternalApprover={isInternalApprover}
                canAddApprovalOptions={canAddApprovalOptions}
                setProcessing={setProcessing}
                spNumber={buildingData?.site_plan_id}
                buildingData={buildingData}
              />
            )}
        </div>
      </div>
      <HeaderBody
        {...props}
        isExternal={isExternal}
        invoiceStatus={invoiceStatus}
        showModalType={showModalType}
        invoicePriority={invoicePriority}
      />
    </div>
  );
};

const HeaderBody = (props) => {
  const {
    id,
    ownerId,
    address,
    buildingData,
    name,
    fileType,
    lot,
    editing,
    toggleEditMode,
    values,
    syncErrors,
    submitFailed,
    invoice,
    status,
    currentUser,
    canVote,
    hasVoted,
    isExternal,
    invoiceStatus,
    exportedToStrataMaster,
    spList,
    showModalType,
    isUnchangeableSourceType,
    invoicePriority,
    job,
    formName,
    deleted
  } = props;
  const dispatch = useDispatch();
  const sitePlanId = buildingData?.site_plan_id;
  const stampRequired = buildingData?.building_rules?.one_off_invoices?.stamp_required;
  const buildingProfileState = useSelector((state) => state.buildingProfile);
  const buildingProfile = buildingProfileState.building;
  const showFailedProcessingToolTip = status === 'processing_failed';
  const lotNumbers = useMemo(() => {
    const items =
      buildingProfileState.lotNumbers?.length > 0
        ? addLabelValues(buildingProfileState.lotNumbers)
        : [];
    return [{ label: 'None', value: null }].concat(items);
  }, [buildingProfileState.lotNumbers]);

  const strataManager = buildingProfile.strata_manager;
  const {
    admin_fund_balance: adminFund,
    sinking_fund_balance: sinkingFund,
    available_balance: availableCash,
    funds_reserve: reserveFund
  } = buildingProfile;
  const availableBalance = parseFloat(adminFund) + parseFloat(sinkingFund);
  const invoiceAmount = parseFloat(invoice?.invoiced_price ?? 0);

  const editDocPermission =
    !invoice && (currentUser?.isSystemManager || currentUser.isTenantManager);
  const editInvoicePermission =
    (currentUser?.document_permissions?.['invoice.manage_email_extraction'] &&
      invoiceConstants.MANAGEABLE_EXTRACTION_STATUSES.includes(status)) ||
    ((canVote ||
      hasVoted ||
      currentUser?.isSystemManager ||
      currentUser?.isOrganisationAdmin ||
      currentUser.id === ownerId) &&
      invoice &&
      !isExternal &&
      !exportedToStrataMaster &&
      !invoiceConstants.NON_EDITABLE_STATUSES.includes(status));

  const fields = (buildingsList, handleBuildingChange) => [
    {
      name: 'name',
      label: 'Name this document'
    },
    {
      name: 'building',
      label: 'Select a building',
      component: 'react-select',
      options: buildingsList,
      customOnChange: handleBuildingChange
    },
    {
      name: 'lot',
      label: 'Select a lot',
      component: 'react-select',
      options: lotNumbers
    }
  ];

  const handleBuildingChange = (e) => {
    dispatch(autofill(formName, 'spNumber', e.value));
  };

  const showDuplicateInvoiceModal = () => {
    dispatch(
      modalActions.showModal('DUPLICATE_INVOICE', { duplicatedDocumentId: invoice?.duplicate, id })
    );
  };

  const processingFailedTooltip = (
    <div className='failed-invoice-tooltip-content'>
      The system will attempt to re-export this invoice automatically for 3 attempts (4 hours). If
      still failed after 3 attempts you can manually attempt re-export. Refer to history log for
      details on retry attempts.
    </div>
  );

  const invoiceStatusBlock = () => {
    if (deleted) {
      return <div className='invoice-status deleted'>DELETED</div>;
    }

    if (invoice) {
      return (
        <div className={`invoice-status ${invoiceStatus.replace(/\s/g, '-')}`}>
          {invoiceStatus === 'approved' ? 'approved for payment' : invoiceStatus}
          {invoice?.is_duplicated && !isMember(currentUser) && (
            <div className='duplicate-invoice-indicator'>
              <Tooltip
                arrow
                title='Duplicate Invoices Found'
                position='bottom'
                animation='fade'
                theme='light'
              >
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  color='red'
                  onClick={showDuplicateInvoiceModal}
                />
              </Tooltip>
            </div>
          )}
          {showFailedProcessingToolTip && (
            <div className='failed-invoice-processing'>
              <Tooltip
                arrow
                html={processingFailedTooltip}
                position='bottom'
                animation='fade'
                theme='light'
                className='failed-invoice-processing-1'
              >
                <FontAwesomeIcon icon={faInfoCircle} color='#D4504B' />
              </Tooltip>
            </div>
          )}
        </div>
      );
    }
  };

  const schedulePaymentDateBlock = () => {
    if (invoice?.schedule_date) {
      if (
        !isMember(currentUser) &&
        !currentUser?.feature_flags?.invoice_transaction_date &&
        !invoiceConstants.NON_SCHEDULABLE_STATUSES.includes(status.toLowerCase())
      ) {
        return (
          <div
            className='payment-date'
            onClick={() =>
              dispatch(modalActions.showModal('SCHEDULE_INVOICE_PAYMENT_DATE', { id, invoice }))
            }
          >
            SCHEDULED PAYMENT DATE: {moment.unix(invoice?.schedule_date).format('DD/MM/YYYY')}
          </div>
        );
      }

      return (
        <div className='payment-date'>
          SCHEDULED PAYMENT DATE: {moment.unix(invoice?.schedule_date).format('DD/MM/YYYY')}
        </div>
      );
    }
  };

  if (editing) {
    return (
      <Accordion title='Document basics:'>
        <div className='document-view-block-content'>
          <Fields
            fields={fields(spList, handleBuildingChange)}
            values={values}
            syncErrors={syncErrors}
            submitFailed={submitFailed}
          />
        </div>
      </Accordion>
    );
  }

  return (
    <>
      {schedulePaymentDateBlock()}
      {invoicePriority && <div className='invoice-priority'>Priority</div>}
      {invoiceStatusBlock()}
      <div className='document-header-row-top'>
        <FileType type={fileType} className='file-image' />
        <div className='li-content'>
          <h3>{name}</h3>
        </div>
        <div className='document-header-buttons'>
          {editInvoicePermission ? (
            <>
              {!isUnchangeableSourceType && (
                <button
                  onClick={toggleEditMode}
                  type='button'
                  className={`button ${editing ? 'primary' : 'secondary'}`}
                >
                  {editing ? 'Save Changes' : 'Edit'}
                </button>
              )}
            </>
          ) : null}

          {editDocPermission && (
            <button
              onClick={toggleEditMode}
              type='button'
              className={`button ${editing ? 'primary' : 'secondary'}`}
            >
              {editing ? 'Save Changes' : 'Edit'}
            </button>
          )}
        </div>
      </div>

      {sitePlanId && (
        <div className='document-view-block-content'>
          <div className='document-header-row'>
            <div className='li-before-content'>
              <FontAwesomeIcon icon={faBuilding} size='lg' />
            </div>

            <div className='li-content'>
              <a
                href={`/building-profile?id=${encodeURIComponent(sitePlanId)}`}
                style={{ color: '#4A90E2' }}
              >
                {address}
              </a>
              {buildingData?.total_lots !== null && buildingData?.total_lots !== undefined && (
                <>
                  &nbsp;&nbsp;|&nbsp;&nbsp;<strong>Lots:&nbsp;</strong>
                  <span>{buildingData?.total_lots}</span>
                </>
              )}
              {buildingData?.state !== 'active' && (
                <>
                  &nbsp;&nbsp;
                  <Tooltip
                    arrow
                    title='Building is not managed'
                    position='bottom'
                    animation='fade'
                    theme='light'
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} size='sm' color='red' />
                  </Tooltip>
                </>
              )}
            </div>
          </div>
          {lot?.label && (
            <div className='document-header-row'>
              <div className='li-before-content'>
                <FontAwesomeIcon icon={faDoorOpen} size='lg' />
              </div>

              <div className='li-content'>
                <span>Lot {lot.label}</span>
              </div>
            </div>
          )}
          {(currencyFormat(adminFund) ||
            currencyFormat(sinkingFund) ||
            currencyFormat(availableBalance)) && (
            <div className='document-header-row'>
              <div className='li-before-content'>
                <FontAwesomeIcon icon={faDollarSign} size='lg' />
              </div>

              <div className='li-content'>
                {currencyFormat(adminFund) && (
                  <>
                    <strong>Admin Fund:&nbsp;</strong>
                    <span>{currencyFormat(adminFund)}</span>
                  </>
                )}
                {currencyFormat(sinkingFund) && (
                  <>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>
                      {currentUser?.country === 'NZ' ? 'Sinking Fund' : 'Capital Works Fund'}:&nbsp;
                    </strong>
                    <span>{currencyFormat(sinkingFund)}</span>
                  </>
                )}
                {currencyFormat(availableBalance) && (
                  <>
                    &nbsp;&nbsp;|&nbsp;&nbsp;<strong>Balance:&nbsp;</strong>
                    {invoiceAmount > availableBalance ? (
                      <>
                        <span style={{ color: 'red' }}>{currencyFormat(availableBalance)}</span>
                        &nbsp;&nbsp;
                        <Tooltip
                          arrow
                          title='Insufficient Funds'
                          position='bottom'
                          animation='fade'
                          theme='light'
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} size='sm' color='red' />
                        </Tooltip>
                      </>
                    ) : (
                      <span>{currencyFormat(availableBalance)}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {(currencyFormat(availableCash) || currencyFormat(reserveFund)) && (
            <div className='document-header-row'>
              <div className='li-before-content'>
                <Tooltip
                  arrow
                  title='Cash at bank less invoices pending payment'
                  position='bottom'
                  animation='fade'
                  theme='light'
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} size='lg' />
                </Tooltip>
              </div>

              <div className='li-content'>
                {currencyFormat(availableCash) && (
                  <>
                    <Tooltip
                      arrow
                      title='Cash at bank less invoices pending payment'
                      position='bottom'
                      animation='fade'
                      theme='light'
                    >
                      <strong>Available Cash:&nbsp;</strong>
                    </Tooltip>
                    {invoiceAmount > availableCash ? (
                      <>
                        <span style={{ color: 'red' }}>{currencyFormat(availableCash)}</span>
                        &nbsp;&nbsp;
                        <Tooltip
                          arrow
                          title='Insufficient Cash'
                          position='bottom'
                          animation='fade'
                          theme='light'
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} size='sm' color='red' />
                        </Tooltip>
                      </>
                    ) : (
                      <span>{currencyFormat(availableCash)}</span>
                    )}
                  </>
                )}
                {currencyFormat(reserveFund) && (
                  <>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>Reserve Fund:&nbsp;</strong>
                    <span>{currencyFormat(reserveFund)}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className='document-header-row'>
            <div className='li-before-content'>
              <FontAwesomeIcon icon={faCalendarAlt} size='lg' />
            </div>

            <div className='li-content'>
              <>
                <strong>Financial Year End:&nbsp;</strong>
                <span>
                  {buildingData?.financial_year_end
                    ? moment
                        .unix(buildingData?.financial_year_end)
                        .format(datetimeConstants.FORMAT.DEFAULT)
                    : 'N/A'}
                </span>
              </>
            </div>
          </div>

          {strataManager && (
            <div className='document-header-row'>
              <div className='li-before-content'>
                <FontAwesomeIcon icon={faUser} size='lg' />
              </div>

              <div className='li-content'>{`${strataManager.full_name} (${strataManager.role} - ${strataManager.organisation})`}</div>
            </div>
          )}

          {job && (
            <div className='document-header-row'>
              <div className='li-before-content'>
                <FontAwesomeIcon icon={faWrench} size='lg' />
              </div>
              <div className='li-content'>
                {isManager(currentUser) || isAdminOrSupport(currentUser) ? (
                  <a
                    href={`${currentUser?.baseUrlWithNameSpace}/jobs/${job?.id}`}
                    style={{ color: '#4A90E2' }}
                  >
                    {job.title}
                  </a>
                ) : (
                  <span>{job.title}</span>
                )}
              </div>
            </div>
          )}
          {stampRequired && (
            <div className='document-header-row'>
              <div className='li-before-content'>
                <FontAwesomeIcon icon={faStamp} size='lg' color='red' />
              </div>
              <div className='li-content'>
                Invoice required to be stamped in order to be processed
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
