import { lotNumberConstants } from '../constants';

export const initialState = {
  list: [],
  listLoading: false
};

export const lotNumbers = (state = initialState, action) => {
  switch (action.type) {
    case lotNumberConstants.GET_LOT_NUMBERS:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case lotNumberConstants.SET_LOT_NUMBER_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    default:
      return state;
  }
};
