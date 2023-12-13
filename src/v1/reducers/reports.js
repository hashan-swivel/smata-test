import {
  GET_REPORTS,
  GET_REPORTS_ERROR,
  GET_REPORTS_SUCCESS,
  GET_REPORT_TYPES,
  GET_REPORT_TYPES_ERROR,
  GET_REPORT_TYPES_SUCCESS
} from '../actions/types';

const initialState = {
  loading: true,
  reports: [],
  types: [],
  error: false
};

export const reports = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORTS:
    case GET_REPORT_TYPES:
      return {
        ...state,
        loading: true
      };
    case GET_REPORTS_SUCCESS:
      return {
        ...state,
        reports: action.payload.reports,
        loading: false
      };
    case GET_REPORTS_ERROR:
    case GET_REPORT_TYPES_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case GET_REPORT_TYPES_SUCCESS:
      return {
        ...state,
        types: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
