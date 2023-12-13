import {
  GET_NOTIFICATION_OPTIONS,
  GET_NOTIFICATION_OPTIONS_SUCCESS,
  GET_NOTIFICATION_SETTINGS,
  GET_NOTIFICATION_SETTINGS_SUCCESS,
  GET_HAS_UNREAD_NOTIFICATIONS_SUCCESS,
  MARK_ALL_READ_SUCCESS,
  NOTIFICATION_REQUEST,
  NOTIFICATION_REQUEST_SUCCESS,
  UNREAD_MESSAGES,
  UPDATE_NOTIFICATION_SETTINGS,
  USER_NOTIFICATIONS_SUCCESS
} from '../actions/types';

const initialState = {
  read: [],
  unread: [],
  hasUnread: false,
  isLoading: false,
  unreadMessages: 0,
  options: {},
  settings: {}
};

const normaliseSettings = (payload) => ({
  ...payload,
  basic: payload.breakdown.filter(({ level }) => level === 'basic'),
  advanced: payload.breakdown.filter(({ level }) => level === 'advanced')
});

export const notifications = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATION_OPTIONS:
    case GET_NOTIFICATION_SETTINGS:
    case NOTIFICATION_REQUEST:
    case UPDATE_NOTIFICATION_SETTINGS:
      return {
        ...state,
        ...action.payload,
        isLoading: true
      };
    case GET_NOTIFICATION_OPTIONS_SUCCESS:
      return {
        ...state,
        options: payload,
        isLoading: false
      };
    case GET_NOTIFICATION_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: normaliseSettings(payload),
        isLoading: false
      };
    case GET_HAS_UNREAD_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        hasUnread: payload
      };
    case MARK_ALL_READ_SUCCESS:
      return {
        ...state,
        hasUnread: false
      };
    case NOTIFICATION_REQUEST_SUCCESS: {
      const read = action?.read || [];
      const unread = action?.unread || [];

      return {
        ...state,
        read,
        unread,
        hasUnread: unread.length > 0,
        isLoading: false
      };
    }
    case UNREAD_MESSAGES:
      return {
        ...state,
        unreadMessages: payload
      };
    case USER_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...payload.data
        },
        isLoading: false
      };
    default:
      return state;
  }
};
