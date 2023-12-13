import { meetingConstants } from '../constants';

const initialState = {
  list: [],
  listLoading: true,
  currentMeeting: null,
  currentMeetingLoading: true,
  error: null
};

export const meetings = (state = initialState, action) => {
  switch (action.type) {
    case meetingConstants.GET_CURRENT_MEETING:
      return {
        ...state,
        currentMeeting: action.payload,
        currentMeetingLoading: false
      };
    case meetingConstants.SET_CURRENT_MEETING_LOADING:
      return {
        ...state,
        currentMeetingLoading: action.payload
      };
    case meetingConstants.GET_MEETINGS:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case meetingConstants.SET_MEETINGS_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    case meetingConstants.SET_MEETING_ERROR:
      return {
        ...state,
        error: action.payload,
        currentMeetingLoading: false
      };
    default:
      return state;
  }
};
