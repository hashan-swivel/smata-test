import React from 'react';
import { useSelector } from 'react-redux';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '../Link';
import { Avatar } from '../Avatar';
import { formatTimeOnly } from '../../../utils/dateTimeHelpers';
import { FileType } from '../index';
import './MessageItem.module.scss';

export const MessageItem = ({
  item,
  index,
  trackMessageOwner,
  editMessage,
  deleteMessage,
  showArchived
}) => {
  const {
    sender,
    body,
    message_files: messageFiles,
    created_at: createdAt,
    updated_at: updatedAt,
    id
  } = item;
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isCurrentUser = sender.id === currentUser.id;
  const isSameMessageOwner = trackMessageOwner[index - 1] === trackMessageOwner[index];
  const timeStamp = () =>
    updatedAt && updatedAt > createdAt
      ? `${formatTimeOnly(updatedAt)} (edited)`
      : formatTimeOnly(createdAt);

  // Checks type of message sent (text, image or document) & renders accordingly
  const checkItemType = () => {
    const getFileExt = (filename) => {
      const parts = filename.split('.');
      return parts[parts.length - 1];
    };

    const acceptedTypes = ['jpg', 'jpeg', 'png'];

    if (messageFiles.length > 0) {
      const messageFilesRendering = messageFiles.map((messageFile) => {
        const fileExt = getFileExt(messageFile.file_name);
        if (acceptedTypes.includes(fileExt)) {
          return (
            <div className='file-download'>
              <Link href={messageFile.file.url} target='_blank'>
                <img src={messageFile.file.medium.url} alt='Uploaded in message' />
              </Link>
            </div>
          );
        }
        return (
          <div className='file-download'>
            <Link href={messageFile.file.url} target='_blank'>
              <FileType type={fileExt} />
            </Link>
          </div>
        );
      });
      return (
        <div>
          <div
            className='paragraph-message multiple-images-case'
            dangerouslySetInnerHTML={{ __html: body }}
          />
          {messageFilesRendering}
        </div>
      );
    }

    if (body && messageFiles.length === 0)
      return (
        <div
          className='paragraph-message test-only-text-case'
          dangerouslySetInnerHTML={{ __html: body }}
        />
      );
    return null;
  };

  return (
    <>
      {!item.is_deleted && (
        <div
          className={`message-item ${isCurrentUser ? 'current-user' : ''} ${
            isSameMessageOwner ? 'group-same-owner' : ''
          }`}
        >
          <Avatar
            firstName={sender.first_name}
            lastName={sender.last_name}
            size='xsmall'
            showTooltip
          />
          <div className='message-body'>
            <div className='message-container'>{checkItemType()}</div>
          </div>
          {isCurrentUser && !showArchived && (
            <div className='message-item-meta-container'>
              <div className='message-item-meta'>
                <div className='message-item-actions'>
                  {body && (
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      onClick={(event) => editMessage(event, id, body)}
                      className='message-item-edit'
                    />
                  )}
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={(event) => deleteMessage(event, id)}
                    className='message-item-delete'
                  />
                </div>
              </div>
              <span className='message-item-date'>{timeStamp()}</span>
            </div>
          )}
          {!isCurrentUser && !showArchived && (
            <div className='message-item-meta-container'>
              <div className='message-item-meta' />
              <span className='message-item-date'>{timeStamp()}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
