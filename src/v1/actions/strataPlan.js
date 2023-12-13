import { axiosInstance } from '../utils';
import { strataPlanConstants } from '../constants';
import { flashActions } from './flash';

const getStrataPlans = (organisationId, active) => async (dispatch) => {
  const params = {
    organisation_id: organisationId,
    active: active || true
  };

  dispatch({ type: strataPlanConstants.SET_STRATA_PLANS_LOADING, payload: true });

  await axiosInstance
    .get(strataPlanConstants.BASE_PATH, { params })
    .then((res) => {
      const { data } = res;
      dispatch({ type: strataPlanConstants.GET_STRATA_PLANS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: strataPlanConstants.SET_STRATA_PLANS_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

export const strataPlanActions = {
  getStrataPlans
};
