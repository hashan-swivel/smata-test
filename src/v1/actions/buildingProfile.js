import { userOptionObj, axiosInstance } from '../utils';
import { buildingProfileConstants } from '../constants';
import { flashActions } from './flash';
import {
  GET_PROFILE,
  GET_CONTACTS,
  GET_LOT_NUMBERS,
  GET_LOT_NUMBERS_SUCCESS,
  GET_LOT_NUMBERS_ERROR,
  SET_CONTACT_DETAILS,
  SET_MODAL_TYPE,
  RESET_BUILDING_PROFILE
} from './types';

// Retrieve the data for a building profile
export const getProfile = (sp) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(`/v1/building_profile/${encodeURIComponent(sp)}`);
    dispatch({
      type: GET_PROFILE,
      payload: data
    });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

export const getContacts = (sp) => async (dispatch) => {
  if (!sp) return null;

  try {
    const { data } = await axiosInstance.get(`/v1/users/contacts?sp_number=${sp}`);
    dispatch({
      type: GET_CONTACTS,
      contacts: data.contacts.map((user) => userOptionObj(user)),
      managers: data.meta
    });
  } catch (error) {
    console.error('Error @ getContacts action', error);
  }
};

export const getLotNumbers = (sp) => async (dispatch) => {
  try {
    dispatch({ type: GET_LOT_NUMBERS });
    const { data } = await axiosInstance.get(
      `/v1/building_profile/${encodeURIComponent(sp)}/lot_numbers`
    );

    dispatch({ type: GET_LOT_NUMBERS_SUCCESS, payload: data.lot_numbers });
  } catch (error) {
    dispatch(flashActions.showError(error));
    dispatch({
      type: GET_LOT_NUMBERS_ERROR,
      error
    });
  }
};

export const setModalType = (modalType) => (dispatch) => {
  dispatch({
    type: SET_MODAL_TYPE,
    payload: modalType
  });
};

export const getContactDetails = (data) => (dispatch) => {
  dispatch({
    type: SET_CONTACT_DETAILS,
    payload: data
  });
};

export const resetBuildingProfile = () => (dispatch) => {
  dispatch({ type: RESET_BUILDING_PROFILE });
};
