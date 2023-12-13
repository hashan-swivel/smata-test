import {
  GET_PROFILE,
  GET_CONTACTS,
  GET_LOT_NUMBERS,
  GET_LOT_NUMBERS_ERROR,
  GET_LOT_NUMBERS_SUCCESS,
  SET_CONTACT_DETAILS,
  SET_MODAL_TYPE,
  RESET_BUILDING_PROFILE
} from '../actions/types';

import { buildingProfileConstants } from '../constants';

export const initialState = {
  building: {},
  contacts: [],
  managers: {},
  contactDetails: {},
  modalType: { name: '' }
};

export const buildingProfile = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        building: action.payload
      };
    case GET_CONTACTS:
      return {
        ...state,
        contacts: action.contacts,
        managers: action.managers
      };
    case GET_LOT_NUMBERS:
      return {
        ...state,
        loading: true
      };
    case GET_LOT_NUMBERS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case GET_LOT_NUMBERS_SUCCESS:
      return {
        ...state,
        lotNumbers: action.payload,
        loading: false
      };
    case SET_CONTACT_DETAILS:
      return {
        ...state,
        contactDetails: action.payload
      };
    case SET_MODAL_TYPE:
      return {
        ...state,
        modalType: action.payload
      };
    case RESET_BUILDING_PROFILE:
      return {
        ...state,
        building: {}
      };
    default:
      return state;
  }
};
