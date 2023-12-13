import { flashConstants } from '../constants';

const show =
  (flashMessage, flashType, flashLength = flashConstants.LENGTH) =>
  (dispatch) => {
    dispatch({ type: flashConstants.SHOW, flashType, flashMessage });

    setTimeout(() => dispatch(hide()), flashLength);
  };

const showError =
  (error, flashLength = flashConstants.LENGTH) =>
  (dispatch) => {
    dispatch(show(errorMessage(error), flashConstants.TYPES.ERROR, flashLength));

    setTimeout(() => dispatch(hide()), flashLength);
  };

const showSuccess =
  (flashMessage, flashLength = flashConstants.LENGTH) =>
  (dispatch) => {
    dispatch(show(flashMessage, flashConstants.TYPES.SUCCESS, flashLength));

    setTimeout(() => dispatch(hide()), flashLength);
  };

const hide = () => (dispatch) => {
  dispatch({ type: flashConstants.HIDE });
};

const errorMessage = (errorResponse) => {
  if (typeof errorResponse !== 'object') return errorResponse;

  const messageObj =
    errorResponse?.response?.data?.message ||
    errorResponse?.response?.data?.errors ||
    errorResponse?.response?.data?.error;
  if (typeof messageObj !== 'object') return messageObj;

  if (Object.keys(messageObj).length === 0) return '';

  let attr = Object.keys(messageObj)[0].replace(/_/g, ' ');

  if (attr.endsWith('.base') || attr.toLowerCase() === 'base') {
    // Temporary workaround since the back-end response is not consistence
    attr = '';
  } else {
    attr = attr.charAt(0).toUpperCase() + attr.slice(1);
  }

  const errorMsg = messageObj[Object.keys(messageObj)[0]][0];

  return `${attr} ${errorMsg}`;
};

export const flashActions = {
  hide,
  show,
  showError,
  showSuccess,
  errorMessage
};
