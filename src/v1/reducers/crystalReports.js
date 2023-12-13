import { crystalReportConstants } from '../constants';

export const initialState = {
  list: [],
  listLoading: false
};

export const crystalReports = (state = initialState, action) => {
  switch (action.type) {
    case crystalReportConstants.GET_CRYSTAL_REPORTS:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case crystalReportConstants.SET_CRYSTAL_REPORTS_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    default:
      return state;
  }
};
