import { ADD_ATTACHMENT } from '../actions/types';

const initialState = {
  attachmentDetails: {}
};

export const addAttachment = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ATTACHMENT:
      return {
        attachmentDetails: action.payload
      };
    default:
      return state;
  }
};
