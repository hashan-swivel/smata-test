import { organisationUserConstants } from '../constants';

const initialState = {
  organisationUsers: [],
  organisationUsersLoading: false
};

export const organisationUsers = (state = initialState, action) => {
  switch (action.type) {
    case organisationUserConstants.GET_ORGANISATION_USERS:
      return {
        ...state,
        organisationUsers: action.payload,
        organisationUsersLoading: false
      };
    case organisationUserConstants.UPDATE_ORGANISATION_USERS_LOADING:
      return {
        ...state,
        organisationUsersLoading: action.payload
      };
    default:
      return state;
  }
};
