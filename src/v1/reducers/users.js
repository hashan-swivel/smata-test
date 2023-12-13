import { GET_ORG_USERS, GET_SP_CONTACTS } from '../actions/types';

const initialState = {
  orgUsers: [],
  contacts: []
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORG_USERS:
      return {
        ...state,
        orgUsers: action.payload
      };
    case GET_SP_CONTACTS:
      return {
        ...state,
        contacts: action.payload
      };
    default:
      return state;
  }
};
