import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { organisationUserConstants } from '../constants';
import { retrieveUser } from './auth';

const constants = organisationUserConstants;

const getOrganisationUsers = () => async (dispatch) => {
  dispatch({ type: constants.UPDATE_ORGANISATION_USERS_LOADING, payload: true });

  await axiosInstance
    .get(constants.BASE_PATH)
    .then((res) => {
      const { data } = res;
      dispatch({ type: constants.GET_ORGANISATION_USERS, payload: data?.organisation_users });
    })
    .catch((error) => {
      dispatch({ type: constants.UPDATE_ORGANISATION_USERS_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const updateOrganisationUser = (id) => async (dispatch) => {
  await axiosInstance
    .put(`${constants.BASE_PATH}/${id}`)
    .then(() => {
      dispatch(retrieveUser(true));
    })
    .catch((error) => {
      dispatch(flashActions.showError(error));
    });
};

export const organisationUserActions = {
  getOrganisationUsers,
  updateOrganisationUser
};
