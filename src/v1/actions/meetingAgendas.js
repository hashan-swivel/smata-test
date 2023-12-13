import { axiosInstance } from '../utils';
import { meetingAgendaConstants } from '../constants';

const getMeetingAgendas = (meetingID) => async (dispatch) => {
  dispatch({ type: meetingAgendaConstants.SET_MEETING_AGENDAS_LOADING, payload: true });

  await axiosInstance
    .get(meetingAgendaConstants.API_BASE_PATH.replace(':meeting_register_id', meetingID))
    .then((res) => {
      const { data } = res;
      dispatch({ type: meetingAgendaConstants.GET_MEETING_AGENDAS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: meetingAgendaConstants.SET_MEETING_AGENDAS_ERROR, payload: error });
    });
};

export const meetingAgendaActions = {
  getMeetingAgendas
};
