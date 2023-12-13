import React from 'react';
import Moment from 'moment';
import { Tooltip } from 'react-tippy';
import { Link } from './Link';

const ICONS = {
  email: 'envelop',
  message: 'inbox',
  reminder: 'bell-regular',
  due: 'clock-regular',
  invoice: 'dollar',
  building: 'building-white',

  else: 'envelop'
};

export const NotificationItem = ({ item, readUnread }) => {
  const { created_at: createdAt, type, url } = item;
  const icon = ICONS[type] || ICONS.else;
  const formattedDate = Moment.unix(createdAt).format('D MMM YY, h:mm A');

  return url ? (
    <Link href={url} classNameProp='notification-dropdown-list-item'>
      {renderItem({
        formattedDate,
        icon,
        item,
        readUnread
      })}
    </Link>
  ) : (
    <div className='notification-dropdown-list-item'>
      {renderItem({
        formattedDate,
        icon,
        item,
        readUnread
      })}
    </div>
  );
};

const renderItem = (props) => {
  const { formattedDate, icon, item, readUnread, reference } = props;
  const { id, body, from: sender, is_read: isRead, title } = item;

  const handleReadUnread = (event) => {
    event.preventDefault();
    readUnread(id, !isRead);
  };

  return (
    <>
      <div className='notification-item-header'>
        <span className={`icon icon-${icon}`} />
        <div className='noti-title' dangerouslySetInnerHTML={{ __html: title }} />
        <span className='noti-ref-hash'>{reference}</span>
      </div>
      <div className='notification-item-body' dangerouslySetInnerHTML={{ __html: body }} />
      <div className='notification-item-footer'>
        <span>
          {sender && `${sender} – `}
          {formattedDate}
        </span>
      </div>
      <Tooltip
        arrow
        title={`Mark as ${isRead ? 'unread' : 'read'}`}
        position='bottom'
        animation='fade'
        theme='light'
        className={`notification-toggle-read ${isRead ? 'read' : 'unread'}`}
      >
        <span role='button' onClick={handleReadUnread} tabIndex='0'></span>
      </Tooltip>
    </>
  );
};
