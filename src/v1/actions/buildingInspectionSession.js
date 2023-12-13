import Router from 'next/router';
import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { modalActions } from './modal';
import { buildingInspectionSessionConstants } from '../constants';

const constants = buildingInspectionSessionConstants;

const getCurrentInspectionSession = () => async (dispatch) => {
  await axiosInstance
    .get(`${constants.BASE_PATH}/current_session`)
    .then((res) => {
      const { data } = res;
      dispatch({ type: constants.GET_CURRENT_SESSION, payload: data });
    })
    .catch((error) => {
      dispatch({ type: constants.UPDATE_CURRENT_SESSION_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const getInspectionSessions = () => async (dispatch) => {
  dispatch({ type: constants.UPDATE_LIST_LOADING, payload: true });

  await axiosInstance
    .get(constants.BASE_PATH)
    .then((res) => {
      const { data } = res;
      dispatch({ type: constants.GET_SESSIONS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: constants.UPDATE_LIST_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const updateSessionAndReload = (id, action) => async (dispatch) => {
  await axiosInstance
    .put(`${constants.BASE_PATH}/${id}/${action}`)
    .then(() => {
      dispatch(flashActions.showSuccess('Done'));
      Router.reload();
    })
    .catch((error) => {
      dispatch(flashActions.showError(error));
    });
};

const startInspection = (id) => async (dispatch) => {
  dispatch(updateSessionAndReload(id, 'start'));
};

const pauseInspection = (id) => async (dispatch) => {
  dispatch(updateSessionAndReload(id, 'pause'));
};

const resumeInspection = (id) => async (dispatch) => {
  dispatch(updateSessionAndReload(id, 'resume'));
};

const stopInspection = (currentSession) => async (dispatch) => {
  await axiosInstance
    .put(`${constants.BASE_PATH}/${currentSession?.id}/stop`)
    .then(() => {
      dispatch({
        type: constants.GET_CURRENT_SESSION,
        payload: { ...currentSession, state: constants.STATES.STOPPED }
      });
      dispatch(
        modalActions.showModal(constants.MODAL_NAME, {
          item: { ...currentSession, state: constants.STATES.STOPPED }
        })
      );
    })
    .catch((error) => {
      // The error is likely to happen when multiple tabs are opened. therefore it can be ignored
      console.log(error);
    });
};

const extendInspection = (id, extended_duration) => async (dispatch) => {
  await axiosInstance
    .put(`${constants.BASE_PATH}/${id}/extend_duration`, { extended_duration })
    .then(() => {
      dispatch(flashActions.showSuccess('Done'));
      Router.reload();
    })
    .catch((error) => {
      dispatch(flashActions.showError(error));
    });
};

export const buildingInspectionSessionActions = {
  getCurrentInspectionSession,
  getInspectionSessions,
  startInspection,
  pauseInspection,
  resumeInspection,
  stopInspection,
  extendInspection
};
