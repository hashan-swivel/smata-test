import React, { useState, useEffect } from 'react';
import { Form, reduxForm, autofill, reset } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';
import { faBuilding, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fields } from '../Form';
import { PhoneInput } from '../Form/Fields';
import { Avatar } from '../Avatar';
import { userOptionObj } from '../../../utils';
import { updateUser } from '../../../actions/auth';
import { Modal } from '../Modal';
import { ProfileImageUpload } from './ProfileImageUpload';
import { modalActions } from '../../../actions';

import './ProfileSettings.module.scss';

const fields = [
  {
    name: 'firstName',
    label: 'First name',
    component: 'input',
    type: 'text'
  },
  {
    name: 'lastName',
    label: 'Last name',
    component: 'input',
    type: 'text'
  },
  {
    name: 'email',
    label: 'Email address',
    component: 'input',
    type: 'email'
  },
  {
    name: 'mobile',
    label: 'Mobile number',
    component: PhoneInput
  },
  {
    name: 'mailingAddress',
    label: 'Mailing Address',
    component: 'input',
    type: 'text'
  }
];

export const ProfileSettingsForm = (props) => {
  const { user, handleSubmit } = props;
  const [modalType, setModalType] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const formState = useSelector((state) => state.form.profileSettings);
  const { values, syncErrors } = formState || {};
  const formData = {
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    mobile: user.phone_number,
    mailingAddress: user.mailing_address
  };
  const dispatch = useDispatch();

  // When component mounts
  useEffect(() => {
    // Check for prepopulated data
    const prepopulatedData = Object.entries(formData);
    // Autofill each field with prepopulated data
    prepopulatedData.forEach((data) => {
      const [field, value] = data;
      dispatch(autofill('profileSettings', field, value));
    });
    // Reset form state on clean up
    return () => dispatch(reset('profileSettings'));
  }, [user]);

  const onSubmit = async () => {
    dispatch(updateUser({ ...values, id: user.id }));
  };

  const openUploadModal = (event) => {
    if (event) event.preventDefault();
    setModalActive(true);
  };

  const closeUploadModal = (event) => {
    if (event) event.preventDefault();
    setModalActive(false);
  };

  const modalContent = () => {
    if (modalType === 'upload_profile') {
      return (
        <ProfileImageUpload openUploadModal={openUploadModal} closeUploadModal={closeUploadModal} />
      );
    }
  };

  const editProfileImageClickedHandler = () => {
    setModalType('upload_profile');
    setModalActive(true);
  };

  return (
    <div className='profile-settings-container'>
      <div className='alert alert--danger text--center' style={{ borderColor: '#842029' }}>
        IMPORTANT: Updating your Profile settings does not notify your manager of the change. Please
        notify your manager directly to update your details.
      </div>

      <div className='user-profile'>
        <div className='profile-avatar-container'>
          <div className='avatar-container'>
            <div className='outer'>
              <Avatar {...userOptionObj(user)} size='large' />
              <button
                type='button'
                className='inner'
                onClick={() => editProfileImageClickedHandler()}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          </div>
          <h2 className='profile-avatar-name'>
            {user.first_name}&nbsp;{user.last_name}
          </h2>
          {user?.isStrataMember && (
            <button
              type='button'
              className='button button--primary'
              onClick={() => dispatch(modalActions.showModal('MY_PROPERTIES'))}
            >
              <FontAwesomeIcon icon={faBuilding} />
              &nbsp;My Properties
            </button>
          )}
        </div>
        <Form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1 }}>
          <Fields fields={fields} values={values} syncErrors={syncErrors} />
          <button type='submit' className='button primary update-profile-button'>
            Save
          </button>
        </Form>
      </div>
      <Modal
        active={modalActive}
        closeModal={closeUploadModal}
        className={modalType === 'upload_profile' ? 'dropzone-modal' : null}
      >
        {modalContent()}
      </Modal>
    </div>
  );
};

export const ProfileSettings = reduxForm({
  form: 'profileSettings'
})(ProfileSettingsForm);
