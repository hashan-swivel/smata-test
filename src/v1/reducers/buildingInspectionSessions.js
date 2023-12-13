import { buildingInspectionSessionConstants } from '../constants';

export const initialState = {
  list: [],
  listLoading: false,
  currentSession: {},
  currentSessionLoading: true
};

export const buildingInspectionSessions = (state = initialState, action) => {
  switch (action.type) {
    case buildingInspectionSessionConstants.GET_CURRENT_SESSION:
      return {
        ...state,
        currentSession: action.payload,
        currentSessionLoading: false
      };
    case buildingInspectionSessionConstants.UPDATE_CURRENT_SESSION_LOADING:
      return {
        ...state,
        currentSessionLoading: action.payload
      };
    case buildingInspectionSessionConstants.GET_SESSIONS:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case buildingInspectionSessionConstants.UPDATE_LIST_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    default:
      return state;
  }
};
