import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { setConversationField } from '../../../actions/messages';
import { Avatar } from '../Avatar';
import { userOptionObj } from '../../../utils/addLabelValue.js';
import './ConversationPreview.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

export const ConversationPreview = ({
  messageData,
  setActiveState,
  showMobileMessage,
  activeState,
  setCurrentUsers,
  archiveChatRoom,
  showArchived,
  selectable,
  selectedIds,
  onSelectionChange
}) => {
  const { id, name, location, users, last_message: lastMessage, attachments } = messageData;
  const address = location ? location.location_name : 'N/A';
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const drafts = useSelector((state) => state.messages.draftMessages);
  const lastMessageBody = useMemo(
    () =>
      lastMessage?.body
        ?.replace(/(<span class="mention">)(.*?)(<\/span>)/g, '$2')
        ?.replace(/<br\s*[/]?>/gi, ' '),
    [lastMessage]
  );

  const isActive = activeState === id;
  // const [unread, setUnread] = useState(messageData.unread);
  // console.log('messageData', messageData);

  const [mountFlag, setMountFlag] = useState(true);
  if (mountFlag) {
    // dispatch(getCurrentMessages(id));
    setMountFlag(false);
  }

  useEffect(() => {
    if (activeState === id) {
      setActiveState(id);
      // dispatch(getCurrentMessages(id));
      setCurrentUsers(users);
    }
  }, [activeState]);

  if (drafts.length > 0) {
    window.onbeforeunload = function () {
      return true;
    };
  }

  // Checks count of users in message, if > 3, adds icon with remainder count of users
  const mapAvatars = () => {
    if (users?.length <= 3) {
      return users.map((user) => {
        const mappedUser = userOptionObj(user);
        return <Avatar key={mappedUser.id} {...mappedUser} size='xsmall' showTooltip />;
      });
    }
    if (users?.length > 3) {
      const newUsersArray = users.slice(0, 2);
      const remainderCount = users.length - 2;
      const otherUsers = users.slice(-remainderCount);

      return (
        <span>
          {newUsersArray.map((user) => {
            const mappedUser = userOptionObj(user);
            return <Avatar key={mappedUser.id} {...mappedUser} size='xsmall' showTooltip />;
          })}
          <Avatar
            remainder={remainderCount}
            tooltipText={otherUsers.map((user) => {
              const mappedUser = userOptionObj(user);
              return mappedUser.label;
            })}
            size='xsmall'
            showTooltip
          />
        </span>
      );
    }
    return null;
  };

  const markAsRead = () => {
    dispatch(setConversationField({ id, field: 'unread_count', value: 0 }));
  };

  const checkDraft = () => {
    return drafts.some((x) => x.id === id && x.message);
  };

  const checkAbiltyToArchived = () => {
    return users.some((obj) => obj.id === currentUser.id);
  };

  const unreadMessageCounterLabel = () => {
    const unreadCount = messageData.unread_count;
    if (unreadCount !== null && unreadCount !== undefined && unreadCount !== 0) {
      if (unreadCount > 9) {
        return <span className='unread-message-counter'>9+</span>;
      } else {
        return <span className='unread-message-counter'>{unreadCount}</span>;
      }
    }

    return null;
  };
  return (
    <div
      role='presentation'
      className={classNames({
        'conversation-preview-container': true,
        active: parseInt(activeState, 10) === messageData.id,
        inactive: parseInt(activeState, 10) !== messageData.id,
        unread:
          messageData.unread_count !== null &&
          messageData.unread_count !== undefined &&
          messageData.unread_count !== 0
      })}
    >
      {selectable && (
        <div className='checkboxes-field' style={{ marginBottom: '10px' }}>
          <div className='option'>
            <input
              id={`selected-chat-message-${id}`}
              name={`selected-chat-message-${id}`}
              onChange={(event) => onSelectionChange(event, id)}
              checked={selectedIds.indexOf(id) !== -1}
              type='checkbox'
            />
            <label htmlFor={`selected-chat-message-${id}`} />
          </div>
        </div>
      )}
      <Link
        href={`/messages?id=${id}`}
        className='link-anchor'
        onClick={() => {
          setActiveState(messageData.id);
          setCurrentUsers(users);
          showMobileMessage();
          markAsRead();
        }}>

        <div className='users-address-container'>
          <div className='avatars'>{mapAvatars()}</div>
          <div className='message-preview-grouping'>
            <div className='icon icon-building-dark message-preview-address'>{address}</div>
            {attachments && attachments.length ? (
              <div className='icon icon-document-dark message-preview-file message-filename'>
                {attachments[0].display_name}
              </div>
            ) : null}
          </div>
        </div>
        <div className='message-preview-title'>
          {unreadMessageCounterLabel()}
          <strong>{name}</strong>
          {checkDraft() && <em className='text-danger'>draft</em>}
        </div>
        <div className='message-preview'>
          {lastMessage?.id ? (
            <span className='message-preview-body'>
              <strong>{lastMessage.sender.first_name}: </strong>
              {lastMessageBody}
            </span>
          ) : (
            <span className='message-preview-body'>
              <strong>You: </strong>
              Start the conversation
            </span>
          )}
          {checkAbiltyToArchived() && (
            <div
              className='message-preview-meta'
              title={moment(lastMessage?.created_at, 'X').format('dddd, MMMM Do YYYY, h:mm:ss a')}
            >
              <span className='message-preview-created'>
                {moment(lastMessage?.created_at, 'X').fromNow()}
              </span>
              <button
                href='#delete'
                type='button'
                className={`message-preview-delete icon icon-${
                  showArchived ? 'add' : 'cross'
                }-dark`}
                onClick={(event) => archiveChatRoom(event, id)}
              >
                {showArchived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          )}
        </div>

      </Link>
    </div>
  );
};

ConversationPreview.propTypes = {
  setActiveState: PropTypes.func,
  showMobileMessage: PropTypes.func,
  activeState: PropTypes.number
};

ConversationPreview.defaultProps = {
  setActiveState: () => {},
  showMobileMessage: () => {},
  activeState: null
};
