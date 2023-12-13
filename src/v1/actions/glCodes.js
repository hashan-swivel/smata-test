import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { glCodeConstants } from '../constants';

const getGlCodes =
  ({ organisationId, spNumber, fundId }) =>
  async (dispatch) => {
    const payload = { sp_number: spNumber, fund_id: fundId, organisation_id: organisationId };
    const type = !spNumber
      ? glCodeConstants.GET_ALL_GL_CODES
      : fundId === 2
        ? glCodeConstants.GET_CWF_GL_CODES
        : glCodeConstants.GET_ADMIN_GL_CODES;

    await axiosInstance
      .get(glCodeConstants.API_BASE_PATH, { params: payload })
      .then((res) => {
        dispatch({ type, payload: res.data.gl_codes });
      })
      .catch((error) => {
        if (error.response.status !== 404 && error.response.status !== 403) {
          dispatch(flashActions.showError(error));
        } else {
          console.log(error);
        }
      });
  };

const getRecentGlCodes =
  ({ spNumber, creditorId }) =>
  async (dispatch) => {
    await axiosInstance
      .get(`${glCodeConstants.API_BASE_PATH}/recently_used`, {
        params: { sp_number: spNumber, creditor_id: creditorId }
      })
      .then((res) => {
        dispatch({ type: glCodeConstants.GET_RECENT_GL_CODES, payload: res.data.gl_codes });
      })
      .catch((error) => {
        if (error.response.status !== 404 && error.response.status !== 403) {
          dispatch(flashActions.showError(error));
        } else {
          console.log(error);
        }
      });
  };

export const glCodeActions = {
  getGlCodes,
  getRecentGlCodes
};
