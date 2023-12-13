import { inAppNoticeboardConstants } from '../constants';

export const initialState = {
  list: [],
  listLoading: false
};

export const inAppNoticeboards = (state = initialState, action) => {
  switch (action.type) {
    case inAppNoticeboardConstants.GET_IN_APP_NOTICEBOARDS:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case inAppNoticeboardConstants.SET_IN_APP_NOTICEBOARDS_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    case inAppNoticeboardConstants.DELETE_IN_APP_NOTICEBOARD:
      return {
        ...state,
        list: state.list.filter((i) => i.id !== action.payload)
      };
    default:
      return state;
  }
};
