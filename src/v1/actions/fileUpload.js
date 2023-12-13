import { axiosInstance } from '../utils/axiosInstance';
import { UPLOAD_FILE, REMOVE_FILE, GET_USER } from './types';
import { postAlert } from './alerts';

export const uploadFile = (file) => (dispatch) => {
  dispatch({
    type: UPLOAD_FILE,
    file
  });
};

export const removeFile = (payload) => (dispatch) => {
  dispatch({
    type: REMOVE_FILE,
    payload
  });
};

export const updateUserProfileImage = (values) => async (dispatch) => {
  try {
    const apiUrl = '/v1/users/update_profile_image';
    const res = await axiosInstance.put(apiUrl, values, {});

    const { data } = res;
    sessionStorage.setItem('user', JSON.stringify(data));
    dispatch({ type: GET_USER, payload: data });
    dispatch(postAlert('Profile image updated', 'success'));
  } catch (error) {
    console.error('error on updating user profile image', error);
  }
};
