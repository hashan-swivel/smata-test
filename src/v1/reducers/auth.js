import { userDecorator } from '../utils/userHelpers';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  GET_USER,
  REFRESH_SUCCESS,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  STORE_LOGIN_LOCATION,
  CLEAR_LOGIN_LOCATION
} from '../actions/types';

export const initialState = {
  isLoading: false,
  currentUser: {},
  loginLocation: null
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case UPDATE_PASSWORD:
      return {
        ...state,
        isLoading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: {}
      };
    case LOGOUT:
      return {
        token: null,
        isLoading: false,
        currentUser: {}
      };
    case GET_USER:
      return {
        ...state,
        isLoading: false,
        currentUser: userDecorator(action.payload)
        // token: action.token,
      };
    case REFRESH_SUCCESS:
      return {
        ...state,
        isLoading: false
        // token: action.token,
      };
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case UPDATE_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case STORE_LOGIN_LOCATION:
      return {
        ...state,
        loginLocation: action.payload
      };
    case CLEAR_LOGIN_LOCATION:
      return {
        ...state,
        loginLocation: null
      };
    default:
      return state;
  }
};
