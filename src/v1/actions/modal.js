import { modalConstants } from '../constants';

export const hideModal = () => (dispatch) => {
  dispatch({ type: modalConstants.HIDE });
};

export const showModal = (modalType, modalProps) => (dispatch) => {
  dispatch({
    type: modalConstants.SHOW,
    modalType,
    modalProps
  });
};

export const modalActions = { hideModal, showModal };
