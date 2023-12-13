import { axiosInstance } from '../utils';
import { meetingConstants } from '../constants';

const getMeeting = (id) => async (dispatch) => {
  dispatch({ type: meetingConstants.SET_CURRENT_MEETING_LOADING, payload: true });

  await axiosInstance
    .get(`${meetingConstants.API_BASE_PATH}/${id}`)
    .then((res) => {
      const { data } = res;
      dispatch({ type: meetingConstants.GET_CURRENT_MEETING, payload: data });
    })
    .catch((error) => {
      dispatch({ type: meetingConstants.SET_MEETING_ERROR, payload: error });
    });
};

const getMeetings =
  (account_id = undefined, params = {}) =>
  async (dispatch) => {
    dispatch({ type: meetingConstants.SET_MEETINGS_LOADING, payload: true });

    await axiosInstance
      .get(meetingConstants.API_BASE_PATH.replace(':account_id', account_id), { params })
      .then((res) => {
        const { data } = res;
        dispatch({ type: meetingConstants.GET_MEETINGS, payload: data.meeting_registers });
      })
      .catch((error) => {
        dispatch({ type: meetingConstants.SET_MEETING_ERROR, payload: error });
      });
  };

export const meetingActions = {
  getMeeting,
  getMeetings
};
