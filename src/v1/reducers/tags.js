import { GET_TAGS, GET_TAGS_SUCCESS, GET_TAGS_ERROR } from '../actions/types';

const initialState = {
  tagsLibrary: [],
  loading: true,
  error: null
};

export const tags = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAGS:
      return {
        ...state,
        loading: true
      };
    case GET_TAGS_SUCCESS:
      return {
        ...state,
        tagsLibrary: action.payload,
        loading: false
      };
    case GET_TAGS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};
