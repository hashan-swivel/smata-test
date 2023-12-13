import React from 'react';
import { connect } from 'react-redux';
import BuildingRules from './BuildingRules';
import BuildingDirectoryModal from './BuildingDirectoryModal';
import SearchTipContents from '../DMS/SearchTipContents';
import BulkApproveInvoice from './BulkApproveInvoice';
import BulkUpdateCategory from './BulkUpdateCategory';
// TODO: Why is this one a redux form?
import { RemindActionUserModal } from '../DMS/RemindActionUserModal';
import StrataMasterApiWizard from './StrataMasterApiWizard';
import FinancialReportsModal from '../DMS/FinancialReports/FinancialReportsModal';
import DuplicatedInvoicesModal from '../DMS/InvoiceView/DuplicatedInvoicesModal';
import CompareConnectCallback from './CompareConnectCallback';
import InspectionSessionModal from '../BuildingInspectionSession/InspectionSessionModal';
import ChatRoomModal from '../Messages/ChatRoomModal';
import JobReferenceModal from './JobReferenceModal';
import CreateEditNoticeboardModal from './CreateEditNoticeboardModal';
import BulkApplySuggestedName from './BulkApplySuggestedName';
import DocumentPreviewModal from './DocumentPreviewModal';
import BulkUpdatePriorityModal from './BulkUpdatePriorityModal';
import OtherLocationsModal from './OtherLocationsModal';
import MyPropertiesModal from './MyPropertiesModal';
import MeetingAttachmentUploadModal from './MeetingAttachmentUploadModal';
import MissingStrataMasterDataModal from './StrataMasterDataLogs/MissingStrataMasterDataModal';
import UpcomingWorkModal from './UpcomingWorkModal';
import CreateEditDigitalNoticeboardModal from './CreateEditDigitalNoticeboardModal';
import DigitalNoticeboardListModal from './DigitalNoticeboardListModal';
import InAppNoticeboardReadMoreModal from './InAppNoticeboardReadMoreModal';
import ScheduleInvoicePaymentDateModal from './ScheduleInvoicePaymentDateModal';

const MODAL_COMPONENTS = {
  BUILDING_RULES: BuildingRules,
  BUILDING_DIRECTORY: BuildingDirectoryModal,
  BULK_UPDATE_CATEGORY: BulkUpdateCategory,
  BULK_APPROVE_INVOICE: BulkApproveInvoice,
  CREATE_EDIT_NOTICEBOARD: CreateEditNoticeboardModal,
  IN_APP_NOTICEBOARD_READ_MORE: InAppNoticeboardReadMoreModal,
  CREATE_EDIT_DIGITAL_NOTICEBOARD: CreateEditDigitalNoticeboardModal,
  DIGITAL_NOTICEBOARD_LIST: DigitalNoticeboardListModal,
  REMIND_ACTION_USER: RemindActionUserModal,
  SEARCH_TIP: SearchTipContents,
  STRATA_MASTER_API_WIZARD: StrataMasterApiWizard,
  DUPLICATE_INVOICE: DuplicatedInvoicesModal,
  FINANCIAL_REPORT: FinancialReportsModal,
  COMPARE_CONNECT_CALLBACK: CompareConnectCallback,
  BUILDING_INSPECTION_SESSION: InspectionSessionModal,
  CHAT_ROOM: ChatRoomModal,
  JOB_REFERENCE: JobReferenceModal,
  BULK_APPLY_SUGGESTED_NAME: BulkApplySuggestedName,
  DOCUMENT_PREVIEW: DocumentPreviewModal,
  BULK_UPDATE_PRIORITY: BulkUpdatePriorityModal,
  MY_PROPERTIES: MyPropertiesModal,
  MEETING_ATTACHMENT_UPLOAD: MeetingAttachmentUploadModal,
  OTHER_BUILDING_LOCATIONS: OtherLocationsModal,
  MISSING_STRATA_MASTER_DATA_MODAL: MissingStrataMasterDataModal,
  UPCOMING_WORK_MODAL: UpcomingWorkModal,
  SCHEDULE_INVOICE_PAYMENT_DATE: ScheduleInvoicePaymentDateModal
};

const ModalRoot = ({ modalType, modalProps }) => {
  if (!modalType) return null;

  const SpecificModal = MODAL_COMPONENTS[modalType];

  return <SpecificModal {...modalProps} />;
};

export default connect((state) => state.modal)(ModalRoot);
// CREDIT: https://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions
