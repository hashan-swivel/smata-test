import { axiosInstance } from '../utils';
import { meetingAttachmentConstants } from '../constants';

const getMeetingAttachments = (params) => async (dispatch) => {
  dispatch({ type: meetingAttachmentConstants.SET_MEETING_ATTACHMENTS_LOADING, payload: true });

  await axiosInstance
    .get(meetingAttachmentConstants.API_BASE_PATH, { params })
    .then((res) => {
      const { data } = res;
      dispatch({ type: meetingAttachmentConstants.GET_MEETING_ATTACHMENTS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: meetingAttachmentConstants.SET_MEETING_ATTACHMENTS_ERROR, payload: error });
    });
};

export const meetingAttachmentActions = {
  getMeetingAttachments
};
