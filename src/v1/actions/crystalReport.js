import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { crystalReportConstants } from '../constants';

const getCrystalReports = (accountId) => async (dispatch) => {
  const params = { account_id: accountId };

  dispatch({ type: crystalReportConstants.SET_CRYSTAL_REPORTS_LOADING, payload: true });

  axiosInstance
    .get(crystalReportConstants.BASE_PATH, { params })
    .then((res) => {
      const { data } = res;
      dispatch({
        type: crystalReportConstants.GET_CRYSTAL_REPORTS,
        payload: data?.crystal_reports
      });
    })
    .catch((error) => {
      dispatch({ type: crystalReportConstants.SET_CRYSTAL_REPORTS_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

export const crystalReportActions = {
  getCrystalReports
};
