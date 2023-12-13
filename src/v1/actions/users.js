import queryString from 'query-string';
import { GET_ORG_USERS, GET_SP_CONTACTS } from './types';
import { axiosInstance } from '../utils';
import { userConstants } from '../constants';

export const getOrgUsers = (orgId, userRole, active) => async (dispatch) => {
  try {
    const res = await axiosInstance.get('/v1/users', {
      params: {
        organisation_id: orgId,
        user_role: userRole,
        user_state: active ? userConstants.ACTIVE_STATES : null
      }
    });

    const { data } = res;
    dispatch({ type: GET_ORG_USERS, payload: data.users });
  } catch (error) {
    console.error('Error @users.js getOrgUsers', error);
  }
};

export const getSpContacts = (spNumber, role) => async (dispatch) => {
  if (!spNumber) return null;

  const queries = queryString.stringify({
    sp_number: spNumber,
    role
  });

  try {
    const apiUrl = `/v1/users/contacts${queries ? `?${queries}` : ''}`;
    const res = await axiosInstance.get(apiUrl);
    const { data } = res;
    dispatch({ type: GET_SP_CONTACTS, payload: data.contacts });
  } catch (error) {
    console.error('Error @users.js getSpContacts', error);
  }
};
