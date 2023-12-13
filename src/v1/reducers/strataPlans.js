import { strataPlanConstants } from '../constants';

export const initialState = {
  list: [],
  listLoading: true
};

export const strataPlans = (state = initialState, action) => {
  switch (action.type) {
    case strataPlanConstants.GET_STRATA_PLANS:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case strataPlanConstants.SET_STRATA_PLANS_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    default:
      return state;
  }
};
