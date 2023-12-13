import { axiosInstance } from '../utils';
import { locationContactConstants } from '../constants';
import { flashActions } from './flash';

const constants = locationContactConstants;

const getLocationContacts = () => async (dispatch) => {
  dispatch({ type: constants.UPDATE_LOCATION_CONTACTS_LOADING, payload: true });

  await axiosInstance
    .get(constants.BASE_PATH)
    .then((res) => {
      const { data } = res;
      dispatch({ type: constants.GET_LOCATION_CONTACTS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: constants.UPDATE_LOCATION_CONTACTS_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

export const locationContactActions = {
  getLocationContacts
};
