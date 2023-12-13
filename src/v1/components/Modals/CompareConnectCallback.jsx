import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalContainer from './ModalContainer';
import { flashActions, modalActions } from '../../../actions';
import { axiosInstance } from '../../../utils';

const CompareConnectCallback = ({ currentUser, dispatch, setSubmitted }) => {
  const { register, handleSubmit } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const leadDetails = currentUser?.compare_connect?.lead;

  const onSubmit = async (data) => {
    setSubmitting(true);

    await axiosInstance
      .put('external_apps/compare_connect/leads', data, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then((_res) => {
        setSuccess(true);
        afterSuccessCallback();
      })
      .catch((e) => {
        dispatch(flashActions.showError(e));
        setSubmitting(false);
      });
  };

  const afterSuccessCallback = () => {
    const MySwal = withReactContent(Swal);

    setSuccess(true);
    MySwal.fire({
      icon: 'success',
      title: 'Thanks!',
      text: 'One of our connection experts will contact you shortly.',
      timer: 2000,
      showConfirmButton: false
    }).then(() => dispatch(modalActions.hideModal()));
  };

  return (
    <ModalContainer
      title="Please confirm your contact details. We'll call you in a few minutes."
      reactModalProps={{
        onAfterClose: setSubmitted(success),
        className: 'c-modal__container c-modal__container--lg'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='c-modal__body duplicated-invoices-modal-container'>
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='phone_number'>Phone:</label>
            </div>
            <input
              className='form__control'
              defaultValue={leadDetails?.phone_number}
              {...register('phone_number')}
              required
              type='tel'
              name='phone_number'
            />
          </div>
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='first_name'>First Name:</label>
            </div>
            <input
              className='form__control'
              defaultValue={leadDetails?.first_name}
              {...register('first_name')}
              required
              name='first_name'
            />
          </div>
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='last_name'>Last Name:</label>
            </div>
            <input
              className='form__control'
              defaultValue={leadDetails?.last_name}
              {...register('last_name')}
              required
              name='last_name'
            />
          </div>
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='email'>Email:</label>
            </div>
            <input
              className='form__control'
              defaultValue={leadDetails?.email}
              {...register('email')}
              required
              type='email'
              name='email'
            />
          </div>
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='postcode'>Postcode:</label>
            </div>
            <input
              className='form__control'
              defaultValue={leadDetails?.postcode}
              {...register('postcode')}
              required
              type='number'
              name='postcode'
            />
          </div>
          <p className='term-and-condition' style={{ maxWidth: '700px' }}>
            By clicking <strong>Confirm</strong>, I agree to Smata Technologies passing through my
            data so that Residential Connections can do a comparison or connection on my energy
            needs. I have read and agree to the Terms and Conditions & Privacy Policy. I confirm
            that Residential Connections may contact me on behalf of Smata Technologies about my
            energy services and have read and agreed to their{' '}
            <a
              href='https://www.compareandconnect.com.au/terms'
              target='_blank'
              rel='noopener noreferrer'
              className='link'
            >
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a
              href='https://www.compareandconnect.com.au/privacy'
              target='_blank'
              rel='noopener noreferrer'
              className='link'
            >
              Privacy Policy
            </a>
          </p>
        </div>
        <div className='c-modal__footer'>
          <button
            type='button'
            className='button button--link-dark'
            disabled={submitting}
            onClick={() => dispatch(modalActions.hideModal())}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='button button--primary'
            disabled={submitting}
            style={{ marginLeft: '10px' }}
          >
            Confirm
          </button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.auth)(CompareConnectCallback);
