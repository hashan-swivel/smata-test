import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { lotNumberConstants } from '../constants';

const getLotNumbers = (params) => async (dispatch) => {
  dispatch({ type: lotNumberConstants.SET_LOT_NUMBER_LOADING, payload: true });

  axiosInstance
    .get(lotNumberConstants.BASE_PATH.replace(':sp_number', params.spNumber))
    .then((res) => {
      const { data } = res;
      dispatch({ type: lotNumberConstants.GET_LOT_NUMBERS, payload: data?.lot_numbers });
    })
    .catch((error) => {
      dispatch({ type: lotNumberConstants.SET_LOT_NUMBER_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

export const lotNumberActions = {
  getLotNumbers
};
