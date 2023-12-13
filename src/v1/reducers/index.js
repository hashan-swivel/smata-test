import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { addAttachment } from './addAttachment';
import { auth } from './auth';
import { buildingDocumentCategories } from './buildingDocumentCategories';
import { buildingInspectionSessions } from './buildingInspectionSessions';
import { buildingProfile } from './buildingProfile';
import { categories } from './categories';
import { counter } from './counter';
import { crystalReports } from './crystalReports';
import { digitalNoticeboards } from './digitalNoticeboards';
import { digitalNoticeboardTemplates } from './digitalNoticeboardTemplates';
import { dms } from './dms';
import { documentImport } from './documentImport';
import { flash } from './flash';
import { inAppNoticeboards } from './inAppNoticeboards';
import { locationContacts } from './locationContacts';
import { lotNumbers } from './lotNumbers';
import { meetingAgendas } from './meetingAgendas';
import { meetingAttachments } from './meetingAttachments';
import { meetings } from './meetings';
import { messages } from './messages';
import { modal } from './modal';
import { notifications } from './notifications';
import { organisationUsers } from './organisationUsers';
import { reports } from './reports';
import { spNumbers } from './spNumbers';
import { strataIntegration } from './strataIntegration';
import { strataPlans } from './strataPlans';
import { tags } from './tags';
import { users } from './users';
import { weather } from './weather';
import { strataMasterDataLogs } from './strataMasterDataLogs';

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  addAttachment,
  auth,
  buildingDocumentCategories,
  buildingInspectionSessions,
  buildingProfile,
  categories,
  counter,
  crystalReports,
  digitalNoticeboards,
  digitalNoticeboardTemplates,
  dms,
  documentImport,
  flash,
  inAppNoticeboards,
  form,
  locationContacts,
  lotNumbers,
  meetingAgendas,
  meetingAttachments,
  meetings,
  messages,
  modal,
  notifications,
  organisationUsers,
  reports,
  spNumbers,
  strataIntegration,
  tags,
  users,
  weather,
  strataMasterDataLogs,
  strataPlans
});

export default rootReducer;
