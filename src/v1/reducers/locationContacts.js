import { locationContactConstants } from '../constants';

const initialState = {
  list: [],
  loading: true
};

export const locationContacts = (state = initialState, action) => {
  switch (action.type) {
    case locationContactConstants.GET_LOCATION_CONTACTS:
      return {
        ...state,
        list: action.payload,
        loading: false
      };
    case locationContactConstants.UPDATE_LOCATION_CONTACTS_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};
