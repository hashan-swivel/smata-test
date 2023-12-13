import Cookie from 'js-cookie';
import Router from 'next/router';
import queryString from 'query-string';
import { axiosInstance, isStrataManager, isMember, baseBackEndUrlWithSubdomain } from '../utils';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  GET_USER,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  STORE_LOGIN_LOCATION,
  CLEAR_LOGIN_LOCATION,
} from './types';
import { shareConstants } from '../constants';
import { flashActions } from './flash';
import { buildingInspectionSessionActions } from './buildingInspectionSession';

// TODO: Not being used as right now the user is logging via Rails app
export const requestLogin = (email, password, url) => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axiosInstance.post(`${process.env.BASE_URL}/oauth/token`, {
      email,
      password,
      grant_type: 'password',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });

    if (data) {
      let cookieObj = {};
      if (process.env.NODE_ENV !== shareConstants.DEVELOPMENT_ENV_NAME) cookieObj = { domain: shareConstants.DOMAIN };
      Cookie.set('access_token', data.access_token, cookieObj);
      Cookie.set('refresh_token', data.refresh_token, cookieObj);
      Cookie.set('expires_at', data.created_at + data.expires_in, cookieObj);
      dispatch({ type: LOGIN_SUCCESS, token: data.access_token });
      dispatch(retrieveUser());
    }
  } catch (err) {
    dispatch(flashActions.showError(err));
  }
};

export const redirectToLogin = () => async _dispatch => {
  const returnPath = Router.asPath;
  const query = queryString.stringify({ return: returnPath });

  window.location.href = `${baseBackEndUrlWithSubdomain()}/login?${query}`;
};

export const storeLoginLocation = location => async dispatch => {
  dispatch({ type: STORE_LOGIN_LOCATION, payload: location });
};

export const clearLoginLocation = () => async dispatch => {
  dispatch({ type: CLEAR_LOGIN_LOCATION });
};

// Retrieve user when 'jwt_token' cookie exists
export const retrieveUser = (redirect = false) => async dispatch => {
  // TODO: user profile is currently set in sessionStorage and redux state, eventually remove from redux as data does not persist

  try {
    const { data } = await axiosInstance.get('/v1/users/me');
    const currentUser = data;

    sessionStorage.setItem('user', JSON.stringify(currentUser));
    sessionStorage.setItem('access_token', Cookie.get('access_token'));

    dispatch({ type: GET_USER, payload: currentUser });

    if (currentUser.role === 'building_inspector') {
      dispatch(buildingInspectionSessionActions.getCurrentInspectionSession());
    }

    if (redirect) {
      window.location.href = currentUser.root_url;
    }
  } catch (error) {
    dispatch(flashActions.showError(`Authentication Error. ${error}`));
    setTimeout(() => dispatch(logoutUser()), 2000);
  }
};

// Log out the user
export const logoutUser = () => async dispatch => {
  await dispatch({ type: GET_USER, payload: {} });
  sessionStorage.clear();

  // For LOCAL testing
  Cookie.remove('access_token', { path: '/', domain: shareConstants.DOMAIN });
  Cookie.remove('refresh_token', { path: '/', domain: shareConstants.DOMAIN });
  Cookie.remove('expires_at', { path: '/', domain: shareConstants.DOMAIN });
  Cookie.remove('is_user_masquerade', { path: '/', domain: shareConstants.DOMAIN });
  window.location.href = `${baseBackEndUrlWithSubdomain()}/logout`;
};

export const updateUser = values => async dispatch => {
  try {
    const apiUrl = `/v1/users/${values.id}?email=${values.email}&first_name=${values.firstName}&last_name=${values.lastName}&mobile_number=${values.mobile}&mailing_address=${values.mailingAddress}`;
    const res = await axiosInstance.put(apiUrl);

    const { data } = res;
    sessionStorage.setItem('user', JSON.stringify(data));
    dispatch({ type: GET_USER, payload: data });
    dispatch(flashActions.showSuccess('Profile updated'));
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

export const updateUserPassword = values => async dispatch => {
  try {
    dispatch({ type: UPDATE_PASSWORD });
    const response = await axiosInstance.put(`/v1/users/${values.id}/update_password`, values);
    const { data } = response;
    dispatch(flashActions.showSuccess('Password updated'));
    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    dispatch(flashActions.showError(error));
    dispatch({ type: UPDATE_PASSWORD_FAILURE, error });
  }
};
