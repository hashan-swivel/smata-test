import { UPLOAD_FILE, REMOVE_FILE } from '../actions/types';

const initialState = {
  files: [
    {
      name: '',
      path: '',
      size: 0,
      type: '',
      docName: '',
      docCategory: ''
    }
  ]
};

export const fileUpload = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_FILE:
      return {
        ...state,
        files: [...state.files, action.file]
      };
    case REMOVE_FILE:
      return {
        ...state,
        files: action.payload
      };
    default:
      return state;
  }
};
