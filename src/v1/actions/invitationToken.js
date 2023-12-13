import axios from 'axios';
import { GET_USER } from './types';
import { authHeader } from '../helpers';
import { flashActions } from './flash';
import { invitationTokenConstants } from '../constants';
import { baseBackEndApiURL } from '../utils';

export const getInvitationToken = (token) => async (dispatch) => {
  // Can't use the axiosInstance wrapper here because the error response will be misunderstood as an UNAUTHORIZED request
  await axios
    .get(`${baseBackEndApiURL}/${invitationTokenConstants.BASE_PATH}/${token}`, {
      headers: authHeader()
    })
    .then((res) => dispatch({ type: GET_USER, payload: res.data }))
    .catch((error) => dispatch(flashActions.showError(error)));
};

export const invitationTokenActions = {
  getInvitationToken
};
