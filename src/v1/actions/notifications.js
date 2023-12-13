import { axiosInstance } from '../utils/axiosInstance';
import { postAlert } from './alerts';
import {
  GET_NOTIFICATION_OPTIONS,
  GET_NOTIFICATION_OPTIONS_SUCCESS,
  GET_NOTIFICATION_SETTINGS,
  GET_NOTIFICATION_SETTINGS_SUCCESS,
  GET_HAS_UNREAD_NOTIFICATIONS,
  GET_HAS_UNREAD_NOTIFICATIONS_SUCCESS,
  MARK_ALL_READ_SUCCESS,
  NOTIFICATION_REQUEST,
  NOTIFICATION_REQUEST_SUCCESS,
  UNREAD_MESSAGES,
  UPDATE_NOTIFICATION_SETTINGS
} from './types';

export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: NOTIFICATION_REQUEST });
    const readNotifications = await axiosInstance.get('/v1/notifications?type=read&per_page=3');
    const unReadNotifications = await axiosInstance.get('/v1/notifications?type=unread&per_page=5');
    const { notifications: readData } = readNotifications.data;
    const { notifications: unreadData } = unReadNotifications.data;
    dispatch({
      type: NOTIFICATION_REQUEST_SUCCESS,
      read: readData,
      unread: unreadData
    });
  } catch (error) {
    console.error('Error @notifications.js fetchNotifications', error);
    dispatch(postAlert('Something went wrong', 'error'));
  }
};

export const readUnreadNotification = (id, flag) => async (dispatch) => {
  try {
    const params = { is_read: flag };
    await axiosInstance.put(`/v1/notifications/${id}`, params);
    await dispatch(fetchNotifications());
  } catch (error) {
    console.error('Error @notifications.js readUnreadNotification', error);
    dispatch(postAlert('Something went wrong', 'error'));
  }
};

export const markAllReadNotification = () => async (dispatch) => {
  try {
    await axiosInstance.put(`/v1/notifications/mark_all_read`);
    await dispatch({ type: MARK_ALL_READ_SUCCESS });
    await dispatch(fetchNotifications());
  } catch (error) {
    console.error('Error @notifications.js markAllReadNotification', error);
    dispatch(postAlert('Something went wrong', 'error'));
  }
};

export const unreadMessageStatus = () => async (dispatch) => {
  try {
    const apiUrl = `/v1/chat_rooms?per_page=10&page=1&last_message=false&attachments=false&users=false&location=false&unread_count=true`;
    const { data } = await axiosInstance.get(apiUrl);
    const chatRooms = data?.chat_rooms;
    const unreadCount = chatRooms.reduce((a, b) => a + b.unread_count, 0);
    dispatch({
      type: UNREAD_MESSAGES,
      payload: unreadCount
    });
  } catch (error) {
    // Handle error
    console.error('Error @notifications.js unreadMessageStatus', error);
  }
};

export const fetchHasUnreadNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: GET_HAS_UNREAD_NOTIFICATIONS });
    const { data } = await axiosInstance.get('/v1/notifications/has_unread');
    dispatch({ type: GET_HAS_UNREAD_NOTIFICATIONS_SUCCESS, payload: data });
  } catch (error) {
    console.log('Error @notiifcations.js fetchHasUnreadNotifications', error);
    dispatch(postAlert('Something went wrong', 'error'));
  }
};

export const fetchNotificationOptions = () => async (dispatch) => {
  try {
    dispatch({ type: GET_NOTIFICATION_OPTIONS });
    const { data } = await axiosInstance.get(`/v1/notification_setting/options`);
    dispatch({ type: GET_NOTIFICATION_OPTIONS_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch(postAlert('Something went wrong', 'error'));
  }
};

export const fetchNotificationSettings = () => async (dispatch) => {
  try {
    dispatch({ type: GET_NOTIFICATION_SETTINGS });
    const { data } = await axiosInstance.get(`/v1/notification_setting`);
    dispatch({ type: GET_NOTIFICATION_SETTINGS_SUCCESS, payload: data });
  } catch (error) {
    console.error('Error @notifications.js fetchNotificationSettings', error);
    dispatch(postAlert('Something went wrong', 'error'));
  }
};

export const updateNotificationSettings = (values) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_NOTIFICATION_SETTINGS });
    const { data } = await axiosInstance.put(`/v1/notification_setting`, values);
    dispatch(postAlert('Notification settings have been saved', 'success'));
    dispatch({ type: GET_NOTIFICATION_SETTINGS_SUCCESS, payload: data });
  } catch (error) {
    console.error('Error @notifications.js updateNotificationSettings', error);
    dispatch(postAlert('Something went wrong', 'error'));
  }
};
