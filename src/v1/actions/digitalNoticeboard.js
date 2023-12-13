import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { digitalNoticeboardConstants } from '../constants';

const constants = digitalNoticeboardConstants;

const getDigitalNoticeboards = (params) => async (dispatch) => {
  dispatch({ type: constants.SET_DIGITAL_NOTICEBOARDS_LOADING, payload: true });

  await axiosInstance
    .get(constants.BASE_PATH, { params })
    .then((res) => {
      const { data } = res;
      dispatch({ type: constants.GET_DIGITAL_NOTICEBOARDS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: constants.SET_DIGITAL_NOTICEBOARDS_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const deleteDigitalNoticeboard = (id) => async (dispatch) => {
  await axiosInstance
    .delete(`${constants.BASE_PATH}/${id}`)
    .then(() => {
      dispatch({ type: constants.DELETE_DIGITAL_NOTICEBOARD, payload: id });
      dispatch(flashActions.showSuccess('Done'));
    })
    .catch((error) => {
      dispatch(flashActions.showError(error));
    });
};

const updateDigitalNoticeboard = (id, data) => async (dispatch) => {
  await axiosInstance
    .put(`${constants.BASE_PATH}/${id}`)
    .then(() => {
      dispatch(getDigitalNoticeboards());
    })
    .catch((error) => {
      dispatch(flashActions.showError(error));
    });
};

export const digitalNoticeboardActions = {
  getDigitalNoticeboards,
  deleteDigitalNoticeboard
};
