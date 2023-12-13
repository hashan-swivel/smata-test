import { flashConstants } from '../constants';

// TODO: move all the postAlert() calls to flashActions.show()
export const postAlert =
  (flashMessage, flashType, flashLength = 4000) =>
  (dispatch) => {
    dispatch({ type: flashConstants.SHOW, flashType, flashMessage });
    setTimeout(() => {
      dispatch({ type: flashConstants.HIDE });
    }, flashLength);
  };
