export const digitalNoticeboardConstants = {
  BASE_PATH: '/v1/digital_noticeboards',
  GET_DIGITAL_NOTICEBOARDS: 'GET_DIGITAL_NOTICEBOARDS',
  SET_DIGITAL_NOTICEBOARDS_LOADING: 'SET_DIGITAL_NOTICEBOARDS_LOADING',
  DELETE_DIGITAL_NOTICEBOARD: 'DELETE_DIGITAL_NOTICEBOARD',
  TYPE: 'digital',
  ALL_STATE_OPTIONS: [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'expired', label: 'Expired' },
    { value: 'scheduled', label: 'Scheduled' }
  ]
};
