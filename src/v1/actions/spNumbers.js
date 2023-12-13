import { GET_SP_NUMBERS, GET_SP_NUMBERS_ERROR, GET_ORG_SP_NUMBERS_SUCCESS } from './types';
import { axiosInstance } from '../utils';

export const getOrgSpNumbers = (orgId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SP_NUMBERS });
    const { data } = await axiosInstance.get(
      `/v1/building_profile/site_plans?active=true${orgId ? `&organisation_id=${orgId}` : ''}`
    );

    dispatch({ type: GET_ORG_SP_NUMBERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_SP_NUMBERS_ERROR,
      error
    });
  }
};
