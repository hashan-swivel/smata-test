import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Form, reduxForm, autofill, reset } from 'redux-form';
import Moment from 'moment';
import get from 'lodash/get';
import set from 'lodash/set';
import { Fields } from '../Form';
import './NotificationSettings.module.scss';
import '../DMS/InvoiceView/Accordion.module.scss';
import {
  fetchNotificationOptions,
  fetchNotificationSettings,
  updateNotificationSettings
} from '../../../actions/notifications';

export const NotificationSettingsForm = ({
  handleSubmit,
  snoozeFor,
  submitFailed,
  unsubscribe
}) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.notificationSettings);
  const settings = useSelector((state) => state.notifications.settings);
  const options = useSelector((state) => state.notifications.options);
  const { values = {}, syncErrors } = formState || {};
  const basicSettings = useMemo(() => values.basic && values.basic[0]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [smsDisabled, setSmsDisabled] = useState(false);
  const [inAppDisabled, setInAppDisabled] = useState(false);

  useEffect(() => {
    dispatch(fetchNotificationSettings());
    dispatch(fetchNotificationOptions());
  }, []);

  useEffect(() => {
    // Check for prepopulated data
    const prepopulatedData = Object.entries(settings);

    // Autofill each field with prepopulated data
    prepopulatedData.forEach((data) => {
      const [field, value] = data;
      dispatch(autofill('notificationSettings', field, value));
    });

    // Reset form state on clean up
    return () => dispatch(reset('notificationSettings'));
  }, [settings]);

  useEffect(() => {
    if (snoozeFor) {
      handleSnooze();
    }
  }, [snoozeFor]);

  useEffect(() => {
    if (unsubscribe) {
      handleUnsubscribe();
    }
  }, [unsubscribe]);

  useEffect(() => {
    if (basicSettings) {
      setEmailDisabled(!basicSettings.email);
      setSmsDisabled(!basicSettings.sms);
      setInAppDisabled(!basicSettings.app);
    }
  }, [basicSettings]);

  const handleToggle = (field) => (checked) => {
    set(values, field, checked);
  };

  const handleFrequencyChange = (field) => (e) => {
    if (/\bbasic\b\[0\]/g.test(field)) {
      values.advanced.map((setting, index) =>
        set(values, `advanced[${index}].email_frequency`, e.target.value)
      );
    }
  };

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvanced(!showAdvanced);
  }, [showAdvanced]);

  const handleSnooze = async () => {
    await dispatch(updateNotificationSettings({ snooze: snoozeFor }));
    Router.push('/settings?section=notifications');
  };

  const handleUnsubscribe = async () => {
    await dispatch(updateNotificationSettings({ unsubscribe }));
    Router.push('/settings?section=notifications');
  };

  const handleUnsnooze = useCallback(() => {
    dispatch(updateNotificationSettings({ notifications_snoozed_until: null }));
  }, [updateNotificationSettings]);

  const onSubmit = async () => {
    const { snooze, basic, advanced } = values;

    dispatch(
      updateNotificationSettings({
        snooze,
        notification_settings_attributes: [...basic, ...advanced]
      })
    );
  };

  const snoozeFields = [
    {
      name: 'snooze',
      label: 'Snooze notifications',
      component: 'select',
      type: 'text',
      options: options.snooze_periods || []
    }
  ];

  const snoozedUntil = useMemo(() => {
    if (settings.snoozed && settings.snoozed_until) {
      return `until ${Moment(settings.snoozed_until).format('Do MMM - h:mma')}`;
    }

    return '';
  }, [settings.snoozed, settings.snoozed_until]);

  return (
    <div className='notification-settings-container'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='notification-settings-row notification-settings-header'>
          <div className='settings-header activity-setting'>Type</div>
          <div className='settings-header setting-toggle'>In app</div>
          <div className='settings-header setting-toggle'>SMS</div>
          <div className='settings-header setting-toggle'>Email</div>
          <div className='settings-header email-frequency'>Email frequency</div>
        </div>

        {values.basic &&
          values.basic.map((setting, index) =>
            renderSetting({
              name: 'basic',
              setting,
              index,
              handleToggle,
              handleFrequencyChange,
              options,
              submitFailed,
              syncErrors,
              values
            })
          )}

        <div className='notification-settings-toggle'>
          <a
            href='#toggleAdvanced'
            onClick={handleToggleAdvanced}
            className={`icon-after icon-chevron-down-dark label${showAdvanced ? ' active' : ''}`}
          >
            Advanced settings
          </a>
        </div>

        {showAdvanced &&
          values.advanced &&
          values.advanced.map((setting, index) =>
            renderSetting({
              name: 'advanced',
              setting,
              index,
              handleToggle,
              handleFrequencyChange,
              options,
              submitFailed,
              syncErrors,
              values,
              emailDisabled,
              smsDisabled,
              inAppDisabled
            })
          )}

        <div className='notification-settings-snooze'>
          {snoozedUntil ? (
            <div className='snooze-message'>
              <div className='label'>Snooze notifications:</div>
              <div>
                Notifications are currently snoozed {snoozedUntil} &bull;{' '}
                <a href='#unsnooze' onClick={handleUnsnooze}>
                  Unsnooze
                </a>
              </div>
            </div>
          ) : (
            <Fields
              fields={snoozeFields}
              containerClass='snooze-fields'
              values={values}
              syncErrors={syncErrors}
            />
          )}
        </div>

        <div className='notification-settings-actions'>
          <button className='button primary' type='submit'>
            Save
          </button>
        </div>
      </Form>
    </div>
  );
};

const renderSetting = ({
  options,
  handleToggle,
  handleFrequencyChange,
  index,
  name,
  setting,
  submitFailed,
  syncErrors,
  values,
  emailDisabled,
  smsDisabled,
  inAppDisabled
}) => {
  const indexedName = `${name}[${index}]`;

  const fields = [
    {
      name: `${indexedName}.heading`,
      component: 'heading',
      label: setting.name,
      hint: <div className='hint'>{setting.description}</div>
    },
    {
      name: `${indexedName}.app`,
      component: 'toggle',
      noLabel: true,
      onChange: handleToggle(`${indexedName}.app`),
      checked: get(values, `${indexedName}.app`),
      classNames: `field-toggle${setting.app_available ? '' : ' hidden'}`,
      disabled: inAppDisabled
    },
    {
      name: `${indexedName}.sms`,
      component: 'toggle',
      noLabel: true,
      onChange: handleToggle(`${indexedName}.sms`),
      checked: get(values, `${indexedName}.sms`),
      classNames: `field-toggle${setting.sms_available ? '' : ' hidden'}`,
      disabled: smsDisabled
    },
    {
      name: `${indexedName}.email`,
      component: 'toggle',
      noLabel: true,
      onChange: handleToggle(`${indexedName}.email`),
      checked: get(values, `${indexedName}.email`),
      classNames: `field-toggle${setting.email_available ? '' : ' hidden'}`,
      disabled: emailDisabled
    },
    {
      name: `${indexedName}.email_frequency`,
      component: 'select',
      noLabel: true,
      customOnChange: handleFrequencyChange(`${indexedName}.email_frequency`),
      options: options.email_frequencies || [],
      classNames: setting.email_available && setting.digest_available ? '' : 'hidden',
      disabled: emailDisabled
    }
  ];

  return (
    <div className='notification-settings-item-container' key={`setting-${setting.key}`}>
      <Fields
        fields={fields}
        containerClass='notification-settings-item notification-settings-row'
        submitFailed={submitFailed}
        syncErrors={syncErrors}
        values={values}
      />
    </div>
  );
};

export const NotificationSettings = reduxForm({
  form: 'notificationSettings'
})(NotificationSettingsForm);
