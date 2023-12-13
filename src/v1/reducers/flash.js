import { flashConstants } from '../constants';

const initialState = {
  flashType: null,
  flashMessage: null
};

export const flash = (state = initialState, action) => {
  switch (action.type) {
    case flashConstants.SHOW:
      return {
        flashType: action.flashType,
        flashMessage: action.flashMessage
      };
    case flashConstants.HIDE:
      return initialState;
    default:
      return state;
  }
};
