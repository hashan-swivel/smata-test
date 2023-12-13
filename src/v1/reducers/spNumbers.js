import { GET_SP_NUMBERS, GET_SP_NUMBERS_ERROR, GET_ORG_SP_NUMBERS_SUCCESS } from '../actions/types';

export const initialState = {
  orgSpNumbers: [],
  loading: true,
  error: null
};

export const spNumbers = (state = initialState, action) => {
  switch (action.type) {
    case GET_SP_NUMBERS:
      return {
        ...state,
        loading: true
      };
    case GET_ORG_SP_NUMBERS_SUCCESS:
      return {
        ...state,
        orgSpNumbers: action.payload,
        loading: false
      };
    case GET_SP_NUMBERS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};
