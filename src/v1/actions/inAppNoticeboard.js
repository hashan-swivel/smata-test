import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { inAppNoticeboardConstants } from '../constants';

const constants = inAppNoticeboardConstants;

const getInAppNoticeboards = (params) => async (dispatch) => {
  dispatch({ type: constants.SET_IN_APP_NOTICEBOARDS_LOADING, payload: true });

  await axiosInstance
    .get(constants.BASE_PATH.replace(':sp_number', params.spNumber), { params })
    .then((res) => {
      const { data } = res;
      dispatch({ type: constants.GET_IN_APP_NOTICEBOARDS, payload: data?.noticeboards });
    })
    .catch((error) => {
      dispatch({ type: constants.SET_IN_APP_NOTICEBOARDS_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const deleteInAppNoticeboard = (id, spNumber) => async (dispatch) => {
  await axiosInstance
    .delete(`${constants.BASE_DELETE_PATH.replace(':sp_number', spNumber)}?noticeboard_id=${id}`)
    .then(() => {
      dispatch({ type: constants.DELETE_IN_APP_NOTICEBOARD, payload: id });
      dispatch(flashActions.showSuccess('Done'));
    })
    .catch((error) => {
      dispatch(flashActions.showError(error));
    });
};

export const inAppNoticeboardActions = {
  getInAppNoticeboards,
  deleteInAppNoticeboard
};
