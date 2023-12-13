import { digitalNoticeboardConstants } from '../constants';

export const initialState = {
  list: [],
  listLoading: false
};

export const digitalNoticeboards = (state = initialState, action) => {
  switch (action.type) {
    case digitalNoticeboardConstants.GET_DIGITAL_NOTICEBOARDS:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case digitalNoticeboardConstants.SET_DIGITAL_NOTICEBOARDS_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    case digitalNoticeboardConstants.DELETE_DIGITAL_NOTICEBOARD:
      return {
        ...state,
        list: state.list.filter((i) => i.id !== action.payload)
      };
    default:
      return state;
  }
};
