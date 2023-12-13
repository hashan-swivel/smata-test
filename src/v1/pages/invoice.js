import React, { useState, useEffect, useRef } from 'react';
import { reduxForm, autofill, reset } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import moment from 'moment';
import Axios from 'axios';
import queryString from 'query-string';
import {
  getSingleDocument,
  updateCurrentDocument,
  getDocuments,
  getGroupCodes,
  resetInvoice
} from '@/actions/dms';
import { addLabelToLotNumber, axiosInstance, stripInput } from '@/utils';
import { getProfile, resetBuildingProfile } from '@/actions/buildingProfile';
import { getOrgSpNumbers } from '@/actions/spNumbers';
import { Layout, Loading } from '@/components/v1';
import {
  Approvers,
  FilePreview,
  FilePreviewFooter,
  Footer,
  Header,
  History,
  Visibility,
  SharedWith
} from '@/components/v1/DMS/DocumentView';
import {
  ApproveInvoice,
  SendToExternal,
  CancelInvoice,
  RejectInvoice,
  ReopenInvoice,
  Creditor,
  InvoiceDetails,
  IsOnHold,
  RowItems,
  OffHold,
  OnHold,
  OtherInvoices,
  validate,
  PassToUser,
  InvoicePriority,
  NoPaymentRequired,
  RequirePayment,
  SchedulePayment
} from '@/components/v1/DMS/InvoiceView';
import { userOptionObj } from '@/utils/addLabelValue';
import { mapInvoiceLineItems, mapRowItems } from '@/components/v1/DMS/helpers/mapRowItems';
import { Modal } from '@/components/v1/Modal';
import { datetimeConstants, invoiceConstants, documentConstants } from '@/constants';
import { flashActions, glCodeActions } from '@/actions';
import Error from './_error';
import RulesModal from '@/components/v1/BuildingProfile/BuildingRules/RulesModal';

import './document-preview.module.scss';
import './invoice.module.scss';

// Set form name
const formName = 'invoiceForm';

const InvoicePreview = ({ submitFailed, docID, anyTouched }) => {
  const currentInvoice = useSelector((state) => state.dms.currentDocument);
  const errorCode = useSelector((state) => state.dms.errorCode);
  const buildingData = useSelector((state) => state.buildingProfile.building);
  const actionsRequired = useSelector((state) => state.dms.meta.my_tasks);
  const [documentDetails, setDocumentDetails] = useState();
  const pageTop = useRef();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [keepDropdownOpen, setKeepDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState();

  // Dropdown lists
  const spList = useSelector((state) => state.spNumbers.orgSpNumbers);
  const spListLoading = useSelector((state) => state.spNumbers.loading);
  const recentGlCodes = useSelector((state) => state.dms.recentGlCodes);
  const allGlCodes = useSelector((state) => state.dms.allGlCodes);
  const adminGlCodes = useSelector((state) => state.dms.adminGlCodes);
  const cwfGlCodes = useSelector((state) => state.dms.cwfGlCodes);
  const groupCodes = useSelector((state) => state.dms.groupCodes);

  // Building rules
  const { building_rules: buildingRules, number_of_voters: numberOfVoters } = buildingData;
  const approvalIntAmount = buildingRules?.one_off_invoices.amount_is_over_internal * 1 || 0;
  const approvalExtAmount = buildingRules?.one_off_invoices.amount_is_over_external * 1 || 0;
  const [approversMap, setApproversMap] = useState({});
  const {
    firstApprover,
    internalApprovers,
    intApproversIds,
    externalApprovers,
    extApproversIds,
    internalApproved,
    externalApproved,
    holdApprovers
  } = approversMap;

  // Current user state
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAdmin = currentUser.role === 'admin';
  const [isApprover, setIsApprover] = useState(false);
  const [isInvoiceOverrider, setIsInvoiceOverrider] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [canVote, setCanVote] = useState(false);

  // Redux form state
  const formState = useSelector((state) => state.form[formName]);
  const { values, syncErrors } = formState;
  const [editing, setEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  // Since not using onSubmit, manually setting submit failure
  const [editFailed, setEditFailed] = useState(false);
  const [deleteRowIds, setDeleteRowIds] = useState([]);
  // For building rule modals & its redux form state
  const [buildingRulesFormModalData, setBuildingRulesFormModalData] = useState({});
  const [buildingProfileHistories, setBuildingProfileHistories] = useState([]);
  const oneOffApprovers = buildingRules?.one_off_invoices?.approvers;
  const [showBuildingRule, setShowBuildingRule] = useState(false);

  // For next invoice strata plan
  const [nextInvoiceStrataPlan, setNextInvoiceStrataPlan] = useState();
  const [listNextInvoicesVisited, setListNextInvoicesVisited] = useState([]);

  // Destructure data from current invoice
  const {
    id,
    display_name: displayName,
    invoice,
    contractor,
    file_extension: fileType,
    history,
    additional_users: sharedWith,
    links,
    owner_id: ownerId,
    locations,
    category,
    exported_to_strata_master: exportedToStrataMaster,
    currently_with: currentlyWith,
    job,
    extraction_status: extractionStatus,
    source,
    organisation_id: organisationId,
    use_custom_bpay_crn: isCustomCrn,
    priority: invoicePriority,
    deleted
  } = currentInvoice || {};

  const jobId = job?.id;
  const invoiceAmount = parseFloat(invoice?.invoiced_price ?? 0);
  const filteredActionsRequired =
    actionsRequired && actionsRequired.filter((i) => !listNextInvoicesVisited.includes(i));
  const lastInvoice =
    filteredActionsRequired && filteredActionsRequired.length > 0
      ? filteredActionsRequired[filteredActionsRequired.length - 1]
      : null; // oldest
  const firstInvoice =
    filteredActionsRequired && filteredActionsRequired.length > 0
      ? filteredActionsRequired[0]
      : null; // newest
  const nextInvoice = filteredActionsRequired ? filteredActionsRequired[0] : null;
  const invoiceAmountIsNoLessInt = invoiceAmount >= approvalIntAmount;
  const invoiceAmountIsNoLessExt = invoiceAmount >= approvalExtAmount;
  const dispatch = useDispatch();
  const spNumber = values?.spNumber;
  const isFirstApprover = currentUser.id === firstApprover?.id;
  const isInternalApprover = intApproversIds?.includes(currentUser.id);
  const canAddApprovalOptions =
    isFirstApprover || isInternalApprover || currentUser?.isOrganisationAdmin;
  const complianceValid = contractor?.compliance_valid;
  const isUnchangeableSourceType =
    invoiceConstants.UNCHANGEABLE_EXTERNAL_SOURCE_TYPES.includes(source);
  const status =
    invoice?.ready_for_approval === false ? 'checking_for_duplicates' : invoice?.status;
  const refreshStatusInterval = useRef(null);
  const approvers = internalApprovers &&
    externalApprovers && [...internalApprovers, ...externalApprovers];
  const currentlyWithUser = approvers?.filter((u) => currentlyWith?.includes(u.id));
  const jobTradeContractor = invoice?.job_trade_contractor_ids?.find(
    (i) => i.contractor_id === contractor?.id
  );
  const originalUpdatedAt = useRef(Date.now() / 1000);

  // this can't be real
  const messageServiceProviderLink =
    currentUser?.namespace &&
    job &&
    jobTradeContractor &&
    `${currentUser?.baseUrlWithNameSpace}/jobs/${job?.id}?job_trade_contractor_id=${jobTradeContractor?.id}`;
  const selectedCreditor = values?.creditor?.creditorName || contractor;

  useEffect(() => {
    const StatusSource = Axios.CancelToken.source();

    const getInvoiceStatus = async () => {
      await axiosInstance
        .get(`/v1/documents/${id}`, { cancelToken: StatusSource.token })
        .then((response) => {
          if (
            response.data.invoice?.ready_for_approval === false ||
            response.data.invoice?.status === 'processing'
          ) {
            refreshStatusInterval.current = setTimeout(getInvoiceStatus, 4000); // call again in 2 seconds
          } else {
            clearTimeout(refreshStatusInterval.current);
            dispatch(updateCurrentDocument(response.data));
          }
        });
    };

    if (invoice?.ready_for_approval === false || invoice?.status === 'processing') {
      getInvoiceStatus();
    }

    return () => {
      clearTimeout(refreshStatusInterval.current);
      StatusSource.cancel();
    };
  }, [invoice]);

  useEffect(() => {
    if (actionsRequired && actionsRequired.includes(currentInvoice?.id)) {
      if (!listNextInvoicesVisited.includes(currentInvoice?.id)) {
        setListNextInvoicesVisited([...listNextInvoicesVisited, currentInvoice?.id]);
      }
    }
    getNextInvoiceInStrataPlan();
  }, [currentInvoice, actionsRequired]);

  const getInvoiceStatus = async () => {
    await axiosInstance.get(`/v1/documents/${id}`).then((response) => {
      if (
        response.data.invoice?.ready_for_approval === false ||
        response.data.invoice?.status === 'processing'
      ) {
        refreshStatusInterval.current = setTimeout(getInvoiceStatus, 4000); // call again in 2 seconds
      } else {
        clearTimeout(refreshStatusInterval.current);
        dispatch(updateCurrentDocument(response.data));
      }
    });
  };

  const getNextInvoiceInStrataPlan = async () => {
    if (currentInvoice && currentInvoice?.sp_number) {
      const queries = queryString.stringify({
        sp_number: currentInvoice?.sp_number,
        my_tasks: true,
        is_invoice: true,
        only_deleted: false,
        page: 1,
        per_page: 50
      });
      await axiosInstance.get(`/v1/documents?${queries}`).then((response) => {
        if (response.data && response.data.documents) {
          const nextInvoiceDocumentStrataPlan = response.data.documents.find(
            (doc) => doc?.id !== currentInvoice?.id && !listNextInvoicesVisited.includes(doc?.id)
          );
          setNextInvoiceStrataPlan(nextInvoiceDocumentStrataPlan?.id);
        }
      });
    }
  };

  const handleGoToNextInvoice = (isStrataPlan) => {
    setProcessing(true);

    if ((isStrataPlan && nextInvoiceStrataPlan) || (!isStrataPlan && nextInvoice)) {
      dispatch(flashActions.showSuccess(`You have approved ${displayName} for payment`));
      Router.push(`/invoice?id=${isStrataPlan ? nextInvoiceStrataPlan : nextInvoice}`);
      setProcessing(false);
    } else {
      dispatch(
        flashActions.show(
          `There are no more next invoices${isStrataPlan ? ' for this plan' : ''}.`,
          'info'
        )
      );
      setTimeout(function () {
        setProcessing(false);
        reloadInvoice();
      }, 5000);
    }
  };

  const handleGoToFirstInvoice = () => {
    setProcessing(true);
    if (firstInvoice) {
      dispatch(flashActions.showSuccess(`You have approved ${displayName} for payment`));
      Router.push(`/invoice?id=${firstInvoice}`);
      setProcessing(false);
    } else {
      dispatch(flashActions.show('There are no more invoices.', 'info'));
      setTimeout(function () {
        setProcessing(false);
        reloadInvoice();
      }, 5000);
    }
  };

  const handleGoToLastInvoice = () => {
    setProcessing(true);

    if (lastInvoice) {
      dispatch(flashActions.showSuccess(`You have approved ${displayName} for payment`));
      Router.push(`/invoice?id=${lastInvoice}`);
      setProcessing(false);
    } else {
      dispatch(flashActions.show('There are no more invoices.', 'info'));
      setTimeout(function () {
        setProcessing(false);
        reloadInvoice();
      }, 5000);
    }
  };

  useEffect(() => {
    if (!allGlCodes && !!organisationId) {
      dispatch(glCodeActions.getGlCodes({ organisationId }));
    }
  }, [organisationId]);

  // Setting the building rules data values to be passed to the building rules modal
  useEffect(() => {
    if (!buildingData?.can_view_building_rule) return;

    const internalApprovers = oneOffApprovers?.filter((x) => x.approver_type === 'internal');
    const externalApprovers = oneOffApprovers?.filter((x) => x.approver_type === 'external');
    const firstApprover = oneOffApprovers?.filter((x) => x.first_approver === true);

    setBuildingRulesFormModalData({
      amountToApprove: buildingRules?.one_off_invoices?.external_approvers_needed,
      oneOffIntRequired: true,
      oneOffIntFirst: firstApprover?.length ? [userOptionObj(...firstApprover)] : null,
      oneOffIntAmount: `$${buildingRules?.one_off_invoices?.amount_is_over_internal}`,
      oneOffIntApproval: internalApprovers?.map(userOptionObj),
      oneOffExtRequired: externalApprovers?.length >= 1,
      oneOffExtAmount: `$${buildingRules?.one_off_invoices?.amount_is_over_external}`,
      oneOffExtApproval: externalApprovers?.map(userOptionObj)
    });

    setBuildingProfileHistories(buildingRules?.histories);
    setShowBuildingRule(true);
  }, [buildingData, currentUser]);

  useEffect(() => {
    const sp = spNumber || currentInvoice?.sp_number;
    if (!sp) return;

    // Admin GL codes
    dispatch(glCodeActions.getGlCodes({ organisationId, spNumber: sp, fundId: 1 }));
    // CWF GL codes
    dispatch(glCodeActions.getGlCodes({ organisationId, spNumber: sp, fundId: 2 }));
    if (currentUser?.organisation_id) {
      dispatch(getGroupCodes(sp));
    }
  }, [spNumber, currentInvoice]);

  useEffect(() => {
    const sp = spNumber || currentInvoice?.sp_number;
    if (currentUser?.organisation_id && selectedCreditor?.id && sp) {
      dispatch(
        glCodeActions.getRecentGlCodes({
          spNumber: sp,
          creditorId: selectedCreditor.id
        })
      );
    }
  }, [spNumber, currentInvoice, selectedCreditor]);

  useEffect(() => {
    dispatch(getSingleDocument(docID));
    if (!actionsRequired) {
      // NOTE: Retrieves user meta data using '/documents' endpoint to get 'my_tasks` array
      // Ideally new endpoint should be made
      dispatch(getDocuments());
    }
    // Clears currentInvoice, glCodes, groupCodes, buildingData on clean up
    return () => {
      dispatch(resetInvoice());
      dispatch(resetBuildingProfile());
      dispatch(reset(formName));
    };
  }, [docID]);

  useEffect(() => {
    // const buildingDataLoading = spNumber && !buildingData.site_plan_id;
    const codesLoading = spNumber && !groupCodes && !adminGlCodes;
    if (documentDetails && !codesLoading) {
      setLoading(false);
    }
  }, [documentDetails, adminGlCodes, groupCodes, spNumber]);

  useEffect(() => {
    if (currentInvoice?.sp_number) dispatch(getProfile(currentInvoice?.sp_number));
  }, [currentInvoice]);

  useEffect(() => {
    const mapInvoiceDetails = () => {
      setDocumentDetails({
        name: displayName,
        building: currentInvoice.building,
        spNumber: currentInvoice.sp_number,
        lot: addLabelToLotNumber(currentInvoice.lot_number, currentInvoice.lot_number_id),
        url: links?.pdf_url || links?.file_url,
        fileType: links?.pdf_url ? documentConstants.PDF_EXTENSION : fileType,
        creditor: {
          creditorName: contractor
            ? {
                label: contractor.name,
                value: contractor.id,
                name: contractor.name,
                id: contractor.id
              }
            : null,
          abn: contractor?.abn,
          invalidABN: contractor?.abn_invalid,
          bsb: contractor?.bsb,
          accountNumber: contractor?.account_no,
          paymentMethod: invoice?.payment_method,
          paymentsEmail: contractor?.payments_email,
          complianceItems: contractor?.compliance_items,
          bpayBillerCode: currentInvoice?.external_creditor_id,
          bpayCrn: isCustomCrn
            ? {
                value: contractor?.bpay_crn,
                label: contractor?.bpay_crn,
                __isNew__: true
              }
            : currentInvoice?.bpay_crn_id,
          gstRegistered:
            currentUser?.country === 'NZ'
              ? invoice?.strata_master_creditor?.gst_registered
              : contractor?.gst_registered,
          externalResourceOrgIds: contractor?.active_external_resource_organisation_ids,
          contractorExternalId: invoice?.contractor_external_id,
          defaultDescription: invoice?.strata_master_creditor?.default_description,
          defaultGlCodeId: invoice?.strata_master_creditor?.default_gl_code_id
        },
        strataMasterCreditor: invoice?.strata_master_creditor,
        invoiceDetails: {
          invoiceNumber: invoice?.invoice_number?.substring(
            0,
            invoiceConstants.INVOICE_NUMBER_MAXLENGTH
          ),
          poNumber: invoice?.po_number,
          invoiceAmount: parseFloat(invoice?.invoiced_price ?? 0),
          invoiceDate: invoice?.date
            ? moment.unix(invoice?.date).format(datetimeConstants.FORMAT.DEFAULT)
            : null,
          invoiceGst: parseFloat(invoice?.gst ?? 0),
          invoiceDueDate: invoice?.due_date
            ? moment.unix(invoice?.due_date).format(datetimeConstants.FORMAT.DEFAULT)
            : null,
          invoiceTransactionDate: invoice?.transaction_date
            ? moment.unix(invoice?.transaction_date).format(datetimeConstants.FORMAT.DEFAULT)
            : null,
          jobTradeId: invoice?.job_trade?.id?.toString()
        },
        rowItems: mapInvoiceLineItems(invoice?.invoice_line_items || []),
        history,
        sharedWith: sharedWith.map((user) =>
          user.is_approver ? { ...userOptionObj(user), isFixed: true } : userOptionObj(user)
        ),
        status: invoice?.status
      });
    };
    if (currentInvoice) {
      scrollToTop();
      mapInvoiceDetails();
    }
  }, [currentInvoice]);

  useEffect(() => {
    if (documentDetails) {
      // Autofill fields with default values
      autofillDefaultValues();
    }
    // Reset form state on clean up
    return () => dispatch(reset(formName));
  }, [documentDetails]);

  useEffect(() => {
    const invoiceId = parseInt(docID, 10);
    const approversData = (buildingRules && buildingRules.one_off_invoices.approvers) || [];
    const userApproverData = approversData.find((x) => x.id === currentUser.id);
    const mapApprovers = () => {
      const mappedApprovers = {
        allApprovers: approversData,
        allApproversIds: [],
        internalApprovers: [],
        intApproversIds: [],
        externalApprovers: [],
        extApproversIds: [],
        firstApprover: null,
        internalApproved: [],
        externalApproved: [],
        holdApprovers: []
      };
      approversData.forEach((user) => {
        if (user.approver_type === 'internal') {
          mappedApprovers.internalApprovers.push(user);
          mappedApprovers.intApproversIds.push(user.id);
          if (user.approved_invoices.includes(invoiceId)) {
            mappedApprovers.internalApproved.push(user);
          }
          if (user.on_hold_invoices.includes(invoiceId)) {
            mappedApprovers.holdApprovers.push(user.id);
          }
        }
        if (user.approver_type === 'external') {
          mappedApprovers.externalApprovers.push(user);
          mappedApprovers.extApproversIds.push(user.id);
          if (user.approved_invoices.includes(invoiceId)) {
            mappedApprovers.externalApproved.push(user);
          }
        }
        if (user.first_approver) mappedApprovers.firstApprover = user;

        mappedApprovers.allApproversIds.push(user.id);
      });
      return mappedApprovers;
    };

    if (userApproverData) {
      setIsApprover(!!userApproverData);
      setHasVoted(userApproverData.approved_invoices.includes(id));
    } else if (currentUser.role === 'strata_manager') {
      setIsApprover(true);
    }

    if (
      approversData.some(
        (user) =>
          user?.id === currentUser.id && currentUser?.document_permissions?.['invoice.override']
      )
    ) {
      setIsInvoiceOverrider(true);
    }

    setApproversMap(mapApprovers());
  }, [buildingRules]);

  useEffect(() => {
    const checkCanVote = () => {
      if (
        isApprover &&
        !hasVoted &&
        currentlyWith?.includes(currentUser.id) &&
        (internalApproved.length + externalApproved.length < numberOfVoters || !numberOfVoters)
      ) {
        setCanVote(true);
      } else setCanVote(false);
    };
    checkCanVote();
  }, [isApprover, hasVoted, currentlyWith, internalApproved, externalApproved]);

  // Fetch users and SP numbers of organisation
  useEffect(() => {
    const { organisation_id: orgId } = currentUser;
    if (!spList.length && spListLoading && (orgId || isAdmin)) dispatch(getOrgSpNumbers(orgId));
  }, [currentUser]);

  const scrollToTop = () => {
    if (pageTop.current) {
      pageTop.current.scrollIntoView();
    }
  };

  const autofillDefaultValues = () => {
    const prepopulatedData = Object.entries(documentDetails);
    prepopulatedData.forEach((ppData) => {
      const [field, value] = ppData;
      dispatch(autofill(formName, field, value));
    });
  };

  const formatDate = (date) => {
    if (!date) return null;
    if (date.constructor === Array && date.length === 0) return null;

    return typeof date === 'string'
      ? date
      : moment(date[0]).format(datetimeConstants.FORMAT.DEFAULT);
  };

  const toggleEditMode = async (event, isSaving, openApprove) => {
    if (event) event.preventDefault();

    const changeDetected = JSON.stringify(documentDetails) !== JSON.stringify(values);
    // TODO: If fields invalid, prevent submit and return error message

    if (syncErrors && isSaving) {
      setEditFailed(true);
      return null;
    }
    // Pressed save button and has pending changes
    if (isSaving && changeDetected) {
      try {
        // make update request to backend
        const {
          creditor,
          invoiceDetails,
          rowItems,
          sharedWith: reduxSharedWith = [],
          status: invoiceStatus
        } = values;

        const newStatus = !invoiceConstants.NON_INITIALIZED_STATUSES.includes(invoiceStatus)
          ? { status: 'under_review' }
          : null;
        const shareWithIds = reduxSharedWith
          .filter((user) => user?.id !== undefined)
          .map((user) => ({ id: user?.id }));
        const shareWithAttributes = shareWithIds.length
          ? { additional_users_attributes: shareWithIds }
          : null;
        const bpayCrnId = {
          bpay_crn_id: creditor?.bpayCrn?.__isNew__ ? null : creditor?.bpayCrn?.value || null
        };
        const customBpayCrn = {
          custom_bpay_crn: creditor?.bpayCrn?.__isNew__ ? creditor?.bpayCrn?.value || null : null
        };
        const contractorAttributes = creditor.creditorName?.value
          ? { contractor_attributes: { id: creditor.creditorName?.value } }
          : null;

        const data = {
          sp_number: values.spNumber,
          lot_number_id: values.lot?.value || null,
          external_creditor_id: creditor?.bpayBillerCode || null,
          display_filename: values?.name,
          ...shareWithAttributes,
          ...bpayCrnId,
          ...contractorAttributes,
          invoice_attributes: {
            original_updated_at: originalUpdatedAt.current,
            date: formatDate(invoiceDetails?.invoiceDate),
            due_date: formatDate(invoiceDetails?.invoiceDueDate),
            transaction_date: formatDate(invoiceDetails?.invoiceTransactionDate),
            invoiced_price: invoiceDetails?.invoiceAmount || 0,
            invoice_number: invoiceDetails.invoiceNumber,
            po_number: invoiceDetails.poNumber,
            gst: invoiceDetails?.invoiceGst || 0,
            job_trade_id: invoiceDetails.jobTradeId ? invoiceDetails.jobTradeId : null,
            payment_method: creditor?.paymentMethod || null,
            contractor_external_id: creditor?.contractorExternalId || null,
            ...customBpayCrn,
            ...newStatus,
            ...mapRowItems(rowItems, deleteRowIds)
          }
        };

        const res = await axiosInstance.put(`${documentConstants.BASE_PATH}/${id}`, { ...data });
        dispatch(updateCurrentDocument(res?.data));
        setDeleteRowIds([]);
        setEditFailed(false);
        setProcessing(false);
        originalUpdatedAt.current = Date.now() / 1000;

        if (openApprove) {
          setEditing(!editing);
          setModalType('approve');
          openModal();
        } else {
          setEditing(!editing);
        }
      } catch (error) {
        setEditFailed(true);
        dispatch(flashActions.showError(error));
        originalUpdatedAt.current = Date.now() / 1000;
      }

      return;
    }
    // Pressed cancel button and has pending changes
    if (editing && !isSaving && changeDetected) {
      const confirm = window.confirm('Are you sure, your changes will not be saved?');
      if (confirm) {
        autofillDefaultValues();
        setEditFailed(false);
        reloadInvoice();
        return setEditing(!editing);
      }
      return null;
    }
    // Toggle without action no changes detected
    return setEditing(!editing);
  };

  const openModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(true);
  };

  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
  };

  const reloadPage = () => {
    Router.reload();
  };

  // reload when invoice sent to stratamaster
  const reloadInvoice = async () => {
    setLoading(true);
    dispatch(getSingleDocument(docID));
  };

  const onToggleInvoicePriority = async (_id, priority, reason) => {
    setProcessing(true);
    closeModal();
    setKeepDropdownOpen(false);

    try {
      await axiosInstance
        .put(`/v1/documents/${id}/update_priority`, { reason, priority })
        .then((res) => {
          dispatch(updateCurrentDocument({ ...currentInvoice, priority }));
        });
      setProcessing(false);
    } catch (error) {
      dispatch(flashActions.showError(error));
      setProcessing(false);
    }
  };

  const getModalComponent = () => {
    if (modalType === 'building-rules') {
      return buildingData?.can_view_building_rule ? (
        <RulesModal
          buildingProfile={buildingData}
          closeModal={closeModal}
          formData={buildingRulesFormModalData}
          setFormData={setBuildingRulesFormModalData}
          buildingProfileHistories={buildingProfileHistories}
          viewOnly
        />
      ) : null;
    }
    if (modalType === 'pass') {
      return (
        <PassToUser
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          internalApprovers={internalApprovers}
          externalApprovers={externalApprovers}
          firstApprover={firstApprover}
          currentUser={currentUser}
          id={id}
          passBack='true'
          spNumber={spNumber}
          status={status}
          docID={docID}
          reloadInvoice={reloadInvoice}
          rowItems={values.rowItems}
          invoice={currentInvoice}
          isInvoiceOverrider={isInvoiceOverrider}
          setProcessing={setProcessing}
          canAddApprovalOptions={canAddApprovalOptions}
          documentName={displayName}
          handleGoToFirstInvoice={handleGoToFirstInvoice}
          handleGoToLastInvoice={handleGoToLastInvoice}
          canGoToFirstAndLastInvoices={firstInvoice && lastInvoice}
        />
      );
    }
    if (modalType === 'cancel') {
      return (
        <CancelInvoice
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          reloadInvoice={reloadInvoice}
          contractor={contractor}
        />
      );
    }
    if (modalType === 'is-on-hold') {
      return <IsOnHold />;
    }
    if (modalType === 'on-hold') {
      return (
        <OnHold
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          reloadPage={reloadPage}
          setProcessing={setProcessing}
        />
      );
    }
    if (modalType === 'take-off-hold') {
      return (
        <OffHold
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          reloadPage={reloadPage}
          setProcessing={setProcessing}
        />
      );
    }
    if (modalType === 'no-payment-required') {
      return (
        <NoPaymentRequired
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          reloadPage={reloadPage}
          setProcessing={setProcessing}
        />
      );
    }
    if (modalType === 'require-payment') {
      return (
        <RequirePayment
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          reloadPage={reloadPage}
          setProcessing={setProcessing}
        />
      );
    }
    if (modalType === 'schedule-payment') {
      return (
        <SchedulePayment
          closeModal={closeModal}
          documentName={displayName}
          id={id}
          invoice={invoice}
          setProcessing={setProcessing}
        />
      );
    }
    if (modalType === 'reject') {
      return (
        <RejectInvoice
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          jobTradeContractorId={invoice?.job_trade_contractor_id}
          reloadInvoice={reloadInvoice}
          contractor={contractor}
        />
      );
    }
    if (modalType === 'reopen') {
      return (
        <ReopenInvoice
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          reloadInvoice={reloadInvoice}
        />
      );
    }

    if (modalType === 'priority') {
      return (
        <InvoicePriority
          closeModal={closeModal}
          setKeepDropdownOpen={setKeepDropdownOpen}
          documentName={displayName}
          id={id}
          currentUser={currentUser}
          internalApprovers={internalApprovers}
          externalApprovers={externalApprovers}
          spNumber={spNumber}
          reloadPage={reloadPage}
          setProcessing={setProcessing}
          invoicePriority={invoicePriority}
          onToggleInvoicePriority={onToggleInvoicePriority}
        />
      );
    }
    if (modalType === 'approve') {
      const externalApproversNeeded = buildingRules?.one_off_invoices.external_approvers_needed;
      const thisUserPutOnHold = holdApprovers.includes(currentUser.id);

      // If this invoice has been passed back to an internal approver they will have been
      // set as voted, so we don't want to send to external approvers just yet.
      const totalInternalApprovers = internalApprovers.length - 1;
      const totalInternalApproved = hasVoted
        ? internalApproved.length - 1
        : internalApproved.length;

      // If final vote, open approve invoice modal
      if (
        (status !== 'on_hold' || thisUserPutOnHold) &&
        // If last internal approver and requires external approval
        totalInternalApprovers === totalInternalApproved &&
        isInternalApprover &&
        externalApproversNeeded
      ) {
        return (
          <SendToExternal
            closeModal={closeModal}
            documentName={displayName}
            id={id}
            spNumber={spNumber}
            currentUser={currentUser}
            sharedWith={documentDetails.sharedWith}
            externalApprovers={externalApprovers.map(userOptionObj)}
            reloadPage={reloadPage}
            reloadInvoice={reloadInvoice}
            status={status}
            rowItems={values.rowItems}
            currentInvoice={currentInvoice}
            externalRequired={invoiceAmountIsNoLessExt}
            nextInvoice={nextInvoice}
            nextInvoiceStrataPlan={nextInvoiceStrataPlan}
            isInvoiceOverrider={isInvoiceOverrider}
            setProcessing={setProcessing}
            canAddApprovalOptions={canAddApprovalOptions}
            processing={processing}
            handleGoToNextInvoice={handleGoToNextInvoice}
            handleGoToFirstInvoice={handleGoToFirstInvoice}
            handleGoToLastInvoice={handleGoToLastInvoice}
            canGoToFirstAndLastInvoices={firstInvoice && lastInvoice}
          />
        );
      }
      if (
        // If only one vote required and current user is first approver
        ((status !== 'on_hold' || thisUserPutOnHold) && numberOfVoters === 1 && isFirstApprover) ||
        // If amount is under threshold and user is internal
        (!invoiceAmountIsNoLessInt && !extApproversIds.includes(currentUser.id)) ||
        // If final internal approver and no external required
        (!externalApproversNeeded &&
          numberOfVoters - 1 === internalApproved.length &&
          !extApproversIds.includes(currentUser.id)) ||
        // If required internals have approved and is external approver
        (internalApprovers.length === internalApproved.length &&
          externalApproversNeeded &&
          extApproversIds.includes(currentUser.id))
      ) {
        return (
          <ApproveInvoice
            closeModal={closeModal}
            documentName={displayName}
            id={id}
            spNumber={spNumber}
            externalApproved={externalApproved}
            currentUser={currentUser}
            reloadInvoice={reloadInvoice}
            rowItems={values.rowItems}
            currentInvoice={currentInvoice}
            nextInvoice={nextInvoice}
            nextInvoiceStrataPlan={nextInvoiceStrataPlan}
            setProcessing={setProcessing}
            canAddApprovalOptions={canAddApprovalOptions}
            processing={processing}
            handleGoToNextInvoice={handleGoToNextInvoice}
            handleGoToFirstInvoice={handleGoToFirstInvoice}
            handleGoToLastInvoice={handleGoToLastInvoice}
            canGoToFirstAndLastInvoices={firstInvoice && lastInvoice}
            isInvoiceOverrider={isInvoiceOverrider}
          />
        );
      }

      // If more than 1 vote is neccesary to approve and amount over threshold, open pass to user modal
      if (numberOfVoters > 1 && isInternalApprover && invoiceAmountIsNoLessInt) {
        return (
          <PassToUser
            closeModal={closeModal}
            setKeepDropdownOpen={setKeepDropdownOpen}
            internalApprovers={internalApprovers}
            externalApprovers={externalApprovers}
            firstApprover={firstApprover}
            currentUser={currentUser}
            id={id}
            spNumber={spNumber}
            inProcess='true'
            status={status}
            reloadInvoice={reloadInvoice}
            rowItems={values.rowItems}
            currentInvoice={currentInvoice}
            isWithCurrentUser={currentlyWith?.includes(currentUser.id)}
            nextInvoice={nextInvoice}
            nextInvoiceStrataPlan={nextInvoiceStrataPlan}
            isInvoiceOverrider={isInvoiceOverrider}
            setProcessing={setProcessing}
            canAddApprovalOptions={canAddApprovalOptions}
            documentName={displayName}
            processing={processing}
            handleGoToNextInvoice={handleGoToNextInvoice}
            handleGoToFirstInvoice={handleGoToFirstInvoice}
            handleGoToLastInvoice={handleGoToLastInvoice}
            canGoToFirstAndLastInvoices={firstInvoice && lastInvoice}
          />
        );
      }
    }
    return null;
  };

  const shareWithComponent = () => {
    if (!currentUser?.isTenantManager) return null;

    if (editing) {
      return (
        <SharedWith
          users={documentDetails.sharedWith}
          values={values}
          syncErrors={syncErrors}
          submitFailed={submitFailed}
          formName={formName}
        />
      );
    }

    return <Visibility data={currentInvoice} />;
  };

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  if (loading) return <Loading />;

  if (currentInvoice) {
    return (
      <>
        {processing && (
          <div className='invoice-processing-overlay'>
            <Loading fill='#fff' componentLoad text='Processing ...' />
          </div>
        )}
        <div className='wrapper document-view-wrapper'>
          <div ref={pageTop} className='doc-scroll-ref' />
          <div className='document-view-left'>
            <Header
              {...documentDetails.building}
              lot={documentDetails.lot}
              name={documentDetails.name}
              editing={editing}
              toggleEditMode={toggleEditMode}
              values={values}
              syncErrors={syncErrors}
              submitFailed={editFailed}
              fileType={fileType}
              invoice={invoice}
              openModal={openModal}
              keepDropdownOpen={keepDropdownOpen}
              setKeepDropdownOpen={setKeepDropdownOpen}
              setModalType={setModalType}
              approvalIntAmount={approvalIntAmount}
              status={status}
              extractionStatus={extractionStatus}
              exportedToStrataMaster={exportedToStrataMaster}
              buildingData={buildingData}
              id={id}
              hasVoted={hasVoted}
              canVote={canVote}
              externalApproved={externalApproved}
              internalApproved={internalApproved}
              numberOfVoters={numberOfVoters}
              ownerId={ownerId}
              strataManager={buildingData.strata_manager}
              externalApprovers={externalApprovers}
              internalApprovers={internalApprovers}
              firstApprover={firstApprover}
              holdApprovers={holdApprovers}
              currentUser={currentUser}
              filename={displayName}
              job={job}
              contractor={contractor}
              spList={spList}
              isWithCurrentUser={currentlyWith?.includes(currentUser.id)}
              sharedWith={sharedWith?.map((user) => userOptionObj(user))}
              isUnchangeableSourceType={isUnchangeableSourceType}
              isInvoiceOverrider={isInvoiceOverrider}
              formName={formName}
              showBuildingRule={showBuildingRule}
              isInternalApprover={intApproversIds.includes(currentUser.id)}
              canAddApprovalOptions={canAddApprovalOptions}
              currentlyWithUser={currentlyWithUser?.map((user) => userOptionObj(user))}
              proccessing={processing}
              setProcessing={setProcessing}
              invoicePriority={invoicePriority}
              deleted={deleted}
              complianceValid={complianceValid}
            />
            <Modal active={showModal} closeModal={closeModal} className={modalType}>
              {getModalComponent()}
            </Modal>
            <Creditor
              editing={editing}
              attachment={currentInvoice}
              spNumber={spNumber}
              currentUser={currentUser}
            />
            <InvoiceDetails
              editing={editing}
              values={values.invoiceDetails}
              syncErrors={syncErrors}
              submitFailed={editFailed}
              formName={formName}
              anyTouched={anyTouched}
              setModalType={setModalType}
              openModal={openModal}
              creditorId={values.creditor?.creditorName?.value}
              spNumber={spNumber}
            />
            <RowItems
              editing={editing}
              values={values.rowItems}
              groupCodes={groupCodes}
              recentGlCodes={recentGlCodes}
              adminGlCodes={adminGlCodes}
              cwfGlCodes={cwfGlCodes}
              allGlCodes={allGlCodes}
              setDeleteRowIds={setDeleteRowIds}
              syncErrors={syncErrors}
              submitFailed={editFailed}
              formName={formName}
              anyTouched={anyTouched}
              jobTitle={job?.title}
              jobTradeGlCode={invoice?.job_trade?.gl_code_id}
              invoiceDetails={values.invoiceDetails}
              currentUser={currentUser}
            />
            <div className={`shared-approvers-grid ${!editing ? 'active' : 'inactive'}`}>
              {shareWithComponent()}
              <Approvers
                editing={editing}
                approvers={
                  internalApprovers && externalApprovers
                    ? [...internalApprovers, ...externalApprovers].map((user) =>
                        userOptionObj(user)
                      )
                    : []
                }
                currentlyWith={currentlyWith}
                id={currentInvoice.id}
                invoiceAmountIsNoLessInt={invoiceAmountIsNoLessInt}
                invoiceAmountIsNoLessExt={invoiceAmountIsNoLessExt}
                openModal={openModal}
                setModalType={setModalType}
                setKeepDropdownOpen={setKeepDropdownOpen}
                currentUser={currentUser}
                buildingData={buildingData}
              />
            </div>
            <History history={documentDetails.history} />
            <Footer
              creditor={values.creditor}
              editing={editing}
              toggleEditMode={toggleEditMode}
              invoice='true'
              id={id}
              buildingData={buildingData}
              spNumber={spNumber}
              locations={locations}
              filename={displayName}
              category={category}
              users={documentDetails.sharedWith}
              approvers={
                internalApprovers && externalApprovers
                  ? [...internalApprovers, ...externalApprovers]
                  : []
              }
              editFailed={editFailed}
              hasJob={!!job}
              messageServiceProviderLink={messageServiceProviderLink}
              currentUser={currentUser}
            />
          </div>
          <div className='document-view-right'>
            <div className='document-right-container'>
              <OtherInvoices nextInvoice={nextInvoice} invoices={actionsRequired?.length} />
              <FilePreview
                url={documentDetails.url}
                type={documentDetails.fileType}
                jobId={jobId}
                doc={currentInvoice}
              />
              <FilePreviewFooter file={documentDetails.url} doc={currentInvoice} jobId={jobId} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

InvoicePreview.getInitialProps = async ({ query }) => {
  const { id: docID } = query;

  return { docID };
};

InvoicePreview.getLayout = (page) => (
  <Layout customSeo={invoiceConstants.SEO} headerClassName='mw-100'>
    {page}
  </Layout>
);

// Wrap component in reduxForm HOC
export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  enableReinitialize: false,
  initialValues: {},
  validate
})(InvoicePreview);
