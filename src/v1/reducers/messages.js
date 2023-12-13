import {
  GET_FILTERED_MESSAGES_SUCCESS,
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  GET_CURRENT_MESSAGES,
  GET_CURRENT_MESSAGES_SUCCESS,
  GET_MESSAGES_ERROR,
  ARCHIVE_CHAT_ROOM,
  DELETE_MESSAGE,
  SEND_MESSAGE,
  NEW_MESSAGE,
  SEND_NEW_OWN_MESSAGE,
  ADD_NEW_CONVERSATION,
  SET_MESSAGES_LOADING,
  SET_MESSAGES_SEARCH_VALUE,
  SET_CONVERSATION_FIELD,
  BROADCAST_DELETE_MESSAGE,
  UPDATE_DRAFT_MESSAGE
} from '../actions/types';

const initialState = {
  items: [],
  currentItems: {},
  meta: {},
  loading: false,
  currentItemsLoading: false,
  fetchingMore: false,
  view: 'unarchived',
  searchFilters: [],
  showAll: false,
  draftMessages: []
};

export const messages = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES: {
      return {
        ...state,
        loading: action.showLoading,
        items: action.showLoading ? [] : state.items,
        fetchingMore: true
      };
    }

    case GET_FILTERED_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...action.payload.chat_rooms]
      };

    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        fetchingMore: false,
        items:
          state.view !== action.payload.view || state.showAll !== action.payload.showAll
            ? [...action.payload.chat_rooms]
            : [...state.items, ...action.payload.chat_rooms],
        meta: action.payload.meta || state.meta,
        view: action.payload.view || state.view,
        showAll: action.payload.showAll ?? state.showAll
      };

    case ARCHIVE_CHAT_ROOM:
      return {
        ...state,
        items: action.payload
      };

    case DELETE_MESSAGE:
      return {
        ...state,
        currentItems: {
          ...state.currentItems,
          messages: action.payload
        }
      };

    case GET_CURRENT_MESSAGES:
      return {
        ...state,
        currentItemsLoading: true
      };

    case GET_CURRENT_MESSAGES_SUCCESS:
      return {
        ...state,
        currentItems: {
          ...action.payload,
          unread_count: 0
        },
        currentItemsLoading: false
      };

    case SET_CONVERSATION_FIELD: {
      const conversationObj = state.items.find((item) => item.id === action.payload.id);
      if (conversationObj) {
        conversationObj[action.payload.field] = action.payload.value;
      }
      return {
        ...state
      };
    }

    case GET_MESSAGES_ERROR:
      return {
        ...state,
        loading: false,
        currentItems: {}
      };

    case SEND_MESSAGE:
      return {
        ...state,
        ...action.payload
      };

    case NEW_MESSAGE:
      return {
        ...state,
        ...action.payload
      };

    case SEND_NEW_OWN_MESSAGE: {
      const { conversation_id: conversationId, messageData } = action.payload;
      const { id: messageId } = messageData;

      const chatRooms = [...state.items];
      const activeChatRoom = chatRooms.find((room) => room.id === conversationId);
      activeChatRoom.last_message = action.payload;

      const currentMessages = [...state.currentItems.messages];

      const existingMessage = currentMessages.find((item) => item.id === messageId);

      if (existingMessage) {
        const indexOfExisting = currentMessages.indexOf(existingMessage);
        currentMessages[indexOfExisting] = messageData;
      } else {
        currentMessages.push(messageData);
      }

      const indexOfActive = chatRooms.indexOf(activeChatRoom);
      chatRooms[indexOfActive] = {
        ...chatRooms[indexOfActive],
        last_message: messageData
      };

      return {
        ...state,
        currentItems: {
          ...state.currentItems,
          messages: currentMessages
        },
        items: chatRooms
      };
    }

    case ADD_NEW_CONVERSATION: {
      state.items.push({ ...action.payload.conversation, unread: true });
      return { ...state };
    }

    case SET_MESSAGES_LOADING: {
      return { ...state, loading: action.payload.loading };
    }

    case SET_MESSAGES_SEARCH_VALUE:
      return {
        ...state,
        searchFilters: action.payload
      };

    case BROADCAST_DELETE_MESSAGE:
      const { conversation_id: conversationId, messageData } = action.payload;
      const { id: messageId } = messageData;
      const chatRooms = [...state.items];
      const activeChatRoom = chatRooms.find((room) => room.id === conversationId);
      const currentMessages = [...state.currentItems.messages];
      const updatedCurrentMessages = currentMessages.map((message) => ({
        ...message,
        is_deleted: message.id === messageId || message.is_deleted
      }));
      const indexOfActive = chatRooms.indexOf(activeChatRoom);
      const lastMessage = updatedCurrentMessages.find((message) => !message.is_deleted);
      chatRooms[indexOfActive] = {
        ...chatRooms[indexOfActive],
        last_message: lastMessage
      };

      return {
        ...state,
        currentItems: {
          ...state.currentItems,
          messages: updatedCurrentMessages
        },
        items: chatRooms
      };

    case UPDATE_DRAFT_MESSAGE: {
      const index = state.draftMessages.findIndex((item) => item.id === action.payload?.id);
      if (index > -1 && action.payload?.message === '') {
        return {
          ...state,
          draftMessages: state.draftMessages.filter((msg) => msg.id !== action.payload?.id)
        };
      } else if (index > -1) {
        return {
          ...state,
          draftMessages: state.draftMessages.map((msg) =>
            msg.id === action.payload.id ? { ...msg, message: action.payload?.message } : msg
          )
        };
      } else {
        return {
          ...state,
          draftMessages: [].concat(state.draftMessages, action.payload)
        };
      }
    }

    default:
      return state;
  }
};
