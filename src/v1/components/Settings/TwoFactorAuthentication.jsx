import { Form, reduxForm, change } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';

import { updateTwoFactorAuthenticationSettings } from '../../../actions/two_factor_authentication';
import { Fields } from '../Form';
import './TwoFactorAuthentication.module.scss';

export const TwoFactorAuthenticationForm = ({ user, handleSubmit }) => {
  const formState = useSelector((state) => state.form.twoFactorAuthenticationSettings);
  const { values, syncErrors } = formState || {};
  const dispatch = useDispatch();

  // FIXME: the logic below is necessary because when the user visits this setting page for the first
  // time, or refreshes this setting page, the variable `user` is `null` initially until the client
  // has fetched user data.
  if (user && !values) {
    dispatch(change('twoFactorAuthenticationSettings', 'two_fa_enabled', user.two_fa_enabled));
  }

  // FIXME: think if the policy object should be serialized as well in the response for `/me`
  const otpEnforcedByOrg =
    user?.otp_setting_controlled_by_organisation && user?.feature_flags?.enforce_2fa;

  const handleEmailOtpChange = (checked) => {
    if (!otpEnforcedByOrg && values) {
      values.two_fa_enabled = !checked;
    }
  };

  const formFields = [
    {
      name: 'two_fa_enabled.heading',
      component: 'heading',
      label: 'Email OTP',
      hint: <div className='hint'>Require OTP for each login attempt</div>
    },
    {
      name: 'two_fa_enabled',
      noLabel: true,
      component: 'toggle',
      classNames: 'field-toggle',
      checked: otpEnforcedByOrg ? true : values?.two_fa_enabled,
      disabled: otpEnforcedByOrg,
      onChange: handleEmailOtpChange
    }
  ];

  const onFormSubmit = () => {
    dispatch(
      updateTwoFactorAuthenticationSettings({
        id: user.id,
        two_fa_enabled: values.two_fa_enabled
      })
    );
  };

  return (
    <div className='otp-settings-container'>
      <div className='otp-settings'>
        <Form onSubmit={handleSubmit(onFormSubmit)} className='otp-settings-form'>
          <Fields
            fields={formFields}
            values={values}
            syncErrors={syncErrors}
            containerClass='otp-settings-field-container'
          />
          <button type='submit' className='button primary save-otp-settings-button'>
            Save
          </button>
        </Form>
      </div>
    </div>
  );
};

export const TwoFactorAuthentication = reduxForm({
  form: 'twoFactorAuthenticationSettings'
})(TwoFactorAuthenticationForm);
