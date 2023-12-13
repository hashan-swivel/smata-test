import { meetingAgendaConstants } from '../constants';

const initialState = {
  list: [],
  listLoading: true,
  listError: null,
  meta: null
};

export const meetingAgendas = (state = initialState, action) => {
  switch (action.type) {
    case meetingAgendaConstants.GET_MEETING_AGENDAS:
      return {
        ...state,
        list: action.payload.meeting_agendas,
        listLoading: false,
        meta: action.payload.meta
      };
    case meetingAgendaConstants.SET_MEETING_AGENDAS_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    case meetingAgendaConstants.SET_MEETING_AGENDAS_ERROR:
      return {
        ...state,
        listError: action.payload,
        listLoading: false
      };
    default:
      return state;
  }
};
