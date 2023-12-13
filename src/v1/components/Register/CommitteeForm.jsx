import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Password from './Password';
import ContactDetails from './ContactDetails';
import { axiosInstance, baseBackEndUrlWithSubdomain } from '../../../utils';
import { flashActions } from '../../../actions';

export const CommitteeForm = ({ invitationToken, role = '' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const theme = useSelector((state) => state.auth.currentUser.theme);
  const [user, setUser] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const previousPage = () => {
    setCurrentStep(currentStep - 1);
  };

  const submitStep1 = async (event) => {
    const { password, passwordConfirm } = event;

    try {
      setIsSubmitting(true);
      const { data } = await axiosInstance.post(
        `/v1/users/?step=1&invitation_token=${invitationToken}&password=${password}&password_confirmation=${passwordConfirm}`
      );
      setUser(data);
      setCurrentStep(currentStep + 1);
      setIsSubmitting(false);
    } catch (error) {
      dispatch(flashActions.showError(error));
      setIsSubmitting(false);
    }
  };

  const submitStep2 = async (event) => {
    const { firstName, lastName, mobileNumber, emailAddress } = event;
    try {
      setIsSubmitting(true);
      const data = {
        step: '2',
        invitation_token: invitationToken,
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        email: emailAddress,
        role
      };
      await axiosInstance.post('/v1/users', data);
      dispatch(flashActions.showSuccess('Login to complete registration'));

      if (role === 'support') {
        window.location.href = `${baseBackEndUrlWithSubdomain()}/backend/jobs`;
      } else {
        window.location.href = baseBackEndUrlWithSubdomain();
      }
      setIsSubmitting(false);
    } catch (error) {
      dispatch(flashActions.showError(error));
      setIsSubmitting(false);
    }
  };

  const formStep = () => {
    switch (currentStep) {
      case 1:
        return <Password onSubmit={submitStep1} isSubmitting={isSubmitting} logo={theme?.logo} />;
      case 2:
        return (
          <ContactDetails
            onSubmit={submitStep2}
            previousPage={previousPage}
            user={user}
            isSubmitting={isSubmitting}
            logo={theme?.logo}
          />
        );
      default:
        return null;
    }
  };

  return formStep();
};
