import { ADD_ATTACHMENT } from './types';

export const addAttachment = (attachmentDetails) => (dispatch) => {
  dispatch({
    type: ADD_ATTACHMENT,
    payload: attachmentDetails
  });
};
