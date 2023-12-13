import { digitalNoticeboardTemplateConstants } from '../constants';

export const initialState = {
  list: [],
  listLoading: false
};

export const digitalNoticeboardTemplates = (state = initialState, action) => {
  switch (action.type) {
    case digitalNoticeboardTemplateConstants.GET_DIGITAL_NOTICEBOARD_TEMPLATES:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case digitalNoticeboardTemplateConstants.SET_DIGITAL_NOTICEBOARDS_TEMPLATES_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    default:
      return state;
  }
};
