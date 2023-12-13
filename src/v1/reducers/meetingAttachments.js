import { meetingAttachmentConstants } from '../constants';

const initialState = {
  list: [],
  listLoading: true,
  listError: null,
  meta: null
};

export const meetingAttachments = (state = initialState, action) => {
  switch (action.type) {
    case meetingAttachmentConstants.GET_MEETING_ATTACHMENTS:
      return {
        ...state,
        list: action.payload.meeting_register_attachments,
        listLoading: false,
        meta: action.payload.meta
      };
    case meetingAttachmentConstants.SET_MEETING_ATTACHMENTS_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    case meetingAttachmentConstants.SET_MEETING_ATTACHMENTS_ERROR:
      return {
        ...state,
        listError: action.payload,
        listLoading: false
      };
    default:
      return state;
  }
};
