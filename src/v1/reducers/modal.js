import { modalConstants } from '../constants';

const initialState = {
  modalType: null,
  modalProps: {}
};

export const modal = (state = initialState, action) => {
  switch (action.type) {
    case modalConstants.SHOW:
      return {
        modalType: action.modalType,
        modalProps: action.modalProps
      };
    case modalConstants.HIDE:
      return initialState;
    default:
      return state;
  }
};
