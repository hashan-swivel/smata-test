import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tippy';
import {
  fetchNotifications,
  fetchHasUnreadNotifications,
  readUnreadNotification,
  markAllReadNotification
} from '../../actions/notifications';
import { NotificationItem } from './NotificationItem';
import { Link } from './Link';
import { Loading } from './Loading';
import './Notifications.module.scss';
import { isContractor, isManager, isMember, isSupport } from '../../utils/helpers';

export const Notifications = ({ user = {} }) => {
  const notificationIndex =
    isContractor(user) || isManager(user) || isSupport(user) || isMember(user);
  const dispatch = useDispatch();
  const notificationsState = useSelector((state) => state.notifications);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const namespace = useMemo(() => user.namespace, [user.role]);
  const allNotificationsUrl = useMemo(
    () =>
      namespace ? `${user?.baseUrlWithNameSpace}/notifications` : `${user?.baseUrl}/notifications`,

    [namespace]
  );

  const {
    unread: unreadNotifications,
    read: readNotifications,
    hasUnread,
    isLoading
  } = notificationsState || {};

  useEffect(() => {
    if (dropdownOpen && !isLoaded) {
      dispatch(fetchNotifications());
      setIsLoaded(true);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    dispatch(fetchHasUnreadNotifications());
  }, []);

  // Handle clicking off the dropdown
  useEffect(() => {
    function handleClick({ target }) {
      const { className } = target;

      if (className && typeof className === 'string' && !className.includes('notification')) {
        return setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [dropdownOpen]);

  // Escape key when dropdown is open closes it
  useEffect(() => {
    function handleKeydown({ keyCode }) {
      if (keyCode === 27) setDropdownOpen(false);
    }

    if (dropdownOpen) {
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }
  }, [dropdownOpen]);

  const handleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const readUnread = async (id, flag) => {
    await dispatch(readUnreadNotification(id, flag));
  };

  const markAllRead = async () => {
    await dispatch(markAllReadNotification());
  };

  if (notificationIndex) {
    return (
      <div className='navbar-menu-item notification-dropdown-container'>
        <div
          role='presentation'
          className='notification-header-dropdown-container'
          onClick={handleDropdown}
        >
          <Tooltip arrow title='Notifications' position='bottom' animation='fade' theme='light'>
            <div className='icon icon-bell-white notification-dropdown-unread-container'>
              {hasUnread && (
                <div className='notification-indicator-wrapper'>
                  <div className='notification-indicator' />
                </div>
              )}
            </div>
          </Tooltip>
          <span className='icon-text'>Notifications</span>
        </div>
        {dropdownOpen && (
          <div className='notification-dropdown-list'>
            {isLoading || !isLoaded ? (
              <Loading />
            ) : (
              <>
                <div className='notification-section'>
                  <b>New for you</b>
                  <Tooltip
                    arrow
                    title='Mark all as read'
                    position='bottom'
                    animation='fade'
                    theme='light'
                    className='notification-mark-all'
                  >
                    <span
                      role='button'
                      className='icon icon-check-double-solid'
                      onClick={() => markAllRead()}
                      tabIndex='0'
                    />
                  </Tooltip>
                </div>
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((item) => (
                    <NotificationItem
                      key={`unread-${item.id}`}
                      item={item}
                      readUnread={readUnread}
                      namespace={namespace}
                    />
                  ))
                ) : (
                  <div className='notification-dropdown-list-item'>
                    <span>No new notifications</span>
                  </div>
                )}
                <div className='notification-section'>
                  <b>Previous</b> (Read)
                </div>
                {readNotifications.map((item) => (
                  <NotificationItem
                    key={`read-${item.id}`}
                    item={item}
                    readUnread={readUnread}
                    namespace={namespace}
                  />
                ))}
                <Link
                  target='_self'
                  classNameProp='notification-section'
                  href={allNotificationsUrl}
                >
                  <b>See all notifications</b>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};
