import React, { useState, useEffect } from 'react';
import { reduxForm, Form } from 'redux-form';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../../../utils/axiosInstance';
import { Avatar } from '../Avatar';
import { postAlert } from '../../../actions/alerts';
import ModalContainer from '../Modals/ModalContainer';
import { modalActions } from '../../../actions';
import {
  updateCurrentDocument,
  bulkRemindDocumentsActionUsers,
  getSingleDocument
} from '../../../actions/dms';
import queryString from 'query-string';
import './RemindActionUserModal.module.scss';

const RemindActionUserForm = ({
  docId,
  currentlyWithUser,
  handleSubmit,
  submitting,
  isInvoicePage,
  bulkRemind,
  selectedItems
}) => {
  const dispatch = useDispatch();
  const onSubmit = async (value) => {
    try {
      if (bulkRemind) {
        dispatch(bulkRemindDocumentsActionUsers(selectedItems));
      } else {
        const queries = queryString.stringify(
          { remind_user_ids: currentlyWithUser.map((user) => user.id) },
          { arrayFormat: 'bracket' }
        );
        const apiUrl = `/v1/documents/${docId}/remind_action_users?${queries}`;
        await axiosInstance.post(apiUrl);
        if (isInvoicePage) {
          dispatch(getSingleDocument(docId));
        }
      }
      dispatch(postAlert(`Remind actions users complete`, 'success'));
    } catch (error) {
      console.error('ERROR @ RemindActionUserForm', error);
      dispatch(postAlert('Oops something went wrong, please try again', 'error'));
    }
    dispatch(modalActions.hideModal());
  };

  return (
    <ModalContainer title='Remind Action Users'>
      <div className='c-modal__body'>
        <div className='remind-user-modal-container'>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {currentlyWithUser &&
              currentlyWithUser.map((user) => (
                <div>
                  <span className='avatar'>
                    <Avatar {...user} size='xsmall' showTooltip />
                  </span>
                  <span>{user?.fullName}</span>
                </div>
              ))}
            <div className='button-container'>
              <button type='submit' className='button primary' disabled={submitting}>
                Remind
              </button>
            </div>
          </Form>
        </div>
      </div>
      <div className='modal__footer' />
    </ModalContainer>
  );
};

export const RemindActionUserModal = reduxForm({
  form: 'remindActionUsers'
})(RemindActionUserForm);
