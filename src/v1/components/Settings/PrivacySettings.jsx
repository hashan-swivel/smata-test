import React, { useState, useEffect } from 'react';
import { Form, reduxForm, autofill, reset } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import set from 'lodash/set';
import { Fields } from '../Form';
import { updatePrivacySettings } from '../../../actions/privacy';
import './PrivacySettings.module.scss';

const renderSetting = ({ name, label, component, hint, handleToggle, syncErrors, values }) => {
  const fields = [
    {
      name: `${name}.heading`,
      component: 'heading',
      label,
      hint
    },
    {
      name,
      noLabel: true,
      component,
      checked: get(values, name),
      classNames: 'field-toggle',
      onChange: handleToggle(name)
    }
  ];
  return (
    <div className='privacy-settings-item-container'>
      <Fields
        fields={fields}
        containerClass='privacy-settings-item privacy-settings-row'
        syncErrors={syncErrors}
        values={values}
      />
    </div>
  );
};

export const PrivacySettingsForm = (props) => {
  const dispatch = useDispatch();
  const { user, handleSubmit } = props;
  const formState = useSelector((state) => state.form.privacySettings);
  const { values, syncErrors } = formState || {};

  useEffect(() => {
    if (user) {
      dispatch(autofill('privacySettings', 'remove_details', !user.is_displayed_in_contact_list));
      dispatch(autofill('privacySettings', 'job_notifications', user.is_job_notifications));
    }

    return () => dispatch(reset('privacySettings'));
  }, [user]);

  const handleToggle = (field) => (checked) => {
    set(values, field, checked);
  };

  const onSubmit = async () => {
    dispatch(
      updatePrivacySettings({
        is_displayed_in_contact_list: !values.remove_details,
        is_job_notifications: values.job_notifications
      })
    );
  };

  const privacyFields = [
    {
      name: 'remove_details',
      label: 'Hide my contact details',
      component: 'toggle',
      hint: (
        <div className='hint'>
          Owners, Building Occupants and Managing Real Estate Agent will not be able to see your
          details in the Building Directory on the Building Profile. These details will only be
          visible to Strata Managers and Building Managers.
        </div>
      )
    },
    {
      name: 'job_notifications',
      label: 'Job Notifications',
      component: 'toggle',
      hint: (
        <div className='hint'>
          Do not be added as a site contact or receive quote and variance voting notifications
        </div>
      )
    }
  ];

  return (
    <div className='privacy-settings-container'>
      <div className='privacy-settings'>
        {user.role === 'strata_member' ? (
          <Form onSubmit={handleSubmit(onSubmit)}>
            {privacyFields.map((setting, index) =>
              renderSetting({
                name: setting.name,
                label: setting.label,
                component: setting.component,
                hint: setting.hint,
                handleToggle,
                syncErrors,
                values
              })
            )}
            <div className='form-actions'>
              <button type='submit' className='button primary'>
                Save
              </button>
            </div>
          </Form>
        ) : (
          <div>No settings to display</div>
        )}
      </div>
    </div>
  );
};

export const PrivacySettings = reduxForm({
  form: 'privacySettings'
})(PrivacySettingsForm);
