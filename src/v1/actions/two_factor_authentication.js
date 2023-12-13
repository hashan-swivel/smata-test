import { axiosInstance } from '../utils';
import { GET_USER } from './types';
import { flashActions } from './flash';

export const updateTwoFactorAuthenticationSettings =
  ({ id, two_fa_enabled }) =>
  async (dispatch) => {
    try {
      const apiUrl = `/v1/users/${id}`;
      const res = await axiosInstance.put(apiUrl, { two_fa_enabled });

      const { data } = res;
      sessionStorage.setItem('user', JSON.stringify(data));

      dispatch({ type: GET_USER, payload: data });
      dispatch(flashActions.showSuccess('Two-factor authentication settings updated'));
    } catch (error) {
      dispatch(flashActions.showError(error));
    }
  };
