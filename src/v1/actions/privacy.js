import { axiosInstance } from '../utils/axiosInstance';
import { postAlert } from './alerts';
import { retrieveUser } from './auth';

export const updatePrivacySettings = (values) => async (dispatch) => {
  try {
    await axiosInstance.put('/v1/users/update_settings', {
      is_displayed_in_contact_list: values.is_displayed_in_contact_list,
      is_job_notifications: values.is_job_notifications
    });
    sessionStorage.removeItem('user');
    dispatch(retrieveUser());
    dispatch(postAlert('Settings updated', 'success'));
  } catch (error) {
    dispatch(postAlert(`Error updating settings: ${error}`, 'error'));
  }
};
