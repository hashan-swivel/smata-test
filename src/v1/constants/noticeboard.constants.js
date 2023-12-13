export const inAppNoticeboardConstants = {
  TYPE: 'internal',
  BASE_CREATE_PATH: '/v1/building_profile/:sp_number/create_noticeboard',
  BASE_UPDATE_PATH: '/v1/building_profile/:sp_number/update_noticeboard',
  BASE_DELETE_PATH: '/v1/building_profile/:sp_number/delete_noticeboard',
  BASE_PATH: '/v1/building_profile/:sp_number/noticeboards',
  CREATE_NOTICEBOARD: 'CREATE_NOTICEBOARD',
  GET_IN_APP_NOTICEBOARDS: 'GET_IN_APP_NOTICEBOARDS',
  SET_IN_APP_NOTICEBOARDS_LOADING: 'SET_IN_APP_NOTICEBOARDS_LOADING',
  DELETE_IN_APP_NOTICEBOARD: 'DELETE_IN_APP_NOTICEBOARD',
  NOTICE_BOARD_TYPE_OPTIONS: [
    { value: 'text', label: 'Text' },
    { value: 'document', label: 'Document' }
  ]
};
