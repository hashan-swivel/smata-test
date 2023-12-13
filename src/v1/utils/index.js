export {
  addLabelToSpList,
  addLabelValueToReportTypes,
  addLabelToCategory,
  addLabelValues,
  userOptionObj,
  addLabelToTags,
  addLabelToLotNumber
} from './addLabelValue';

export { axiosInstance } from './axiosInstance';

export {
  isAdmin,
  isMember,
  isOwner,
  isOrganisationAdmin,
  isOwnerSubRole,
  isStrataManager,
  isSupport,
  isCommitteeMember,
  isManager,
  isAdminOrSupport,
  calcRatings
} from './helpers';

export { groupBy, chunk } from './array';
export { gstCalculator } from './invoiceHelpers';
export {
  inspectionDurationFormat,
  formatDateOnly,
  formatFullDateTime,
  currentTimeInShortFormat
} from './dateTimeHelpers';
export {
  stripInput,
  currencyFormat,
  getOrdinal,
  humanize,
  getFileExtension,
  humanizeFileSize,
  filenameWithoutExtension
} from './stringHelpers';
export { warningSwal, loadingSwal } from './swalHelper';
export { boolToString } from './booleanHelpers';
export { baseBackEndUrlWithSubdomain, baseBackendURL, baseBackEndApiURL } from './urlHelpers';
export { menuPortalTarget } from './modalHelpers';
export { autoDownloadLink } from './documentHelpers';
