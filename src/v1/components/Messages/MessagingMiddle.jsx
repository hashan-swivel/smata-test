import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateOnly, warningSwal } from '../../../utils';
import { MessageItem, MessageBox, MessageStart } from './index';
import { deleteMessage } from '../../../actions/messages';
import { Loading } from '../Loading';

import './MessagingMiddle.module.scss';

export const MessagingMiddle = (props) => {
  const [editing, setEditing] = useState(false);
  const [groupByDateMap, setGroupByDateMap] = useState({});

  const {
    currentMessages,
    currentHistories,
    currentUsers,
    messageData,
    showOptionsModal,
    queryId,
    showArchived,
    currentFileAttachments,
    setCurrentFileAttachmentsCallback
  } = props;

  const currentUser = useSelector((state) => state.auth.currentUser);
  const canAddMessage = !currentUser?.isBuildingInspector;
  const dispatch = useDispatch();

  useEffect(() => {
    const map = currentMessages
      .concat(currentHistories)
      .sort((a, b) =>
        a.created_at === b.created_at ? a.type.localeCompare(b.type) : a.created_at - b.created_at
      )
      .reduce((acc, msg) => {
        const date = moment.unix(msg.created_at).format('D-MMM-YYYY');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(msg);
        return acc;
      }, {});

    setGroupByDateMap(map);
  }, [currentMessages, currentHistories]);

  const messageGroupEnd = useRef();

  const scrollToBottom = () => {
    if (messageGroupEnd.current) messageGroupEnd.current.scrollIntoView({ block: 'end' });
  };

  useLayoutEffect(scrollToBottom);

  const handleEditMessage = (event, id, value) => {
    event.preventDefault();
    setEditing({ id, value });
    setCurrentFileAttachmentsCallback([]);
  };

  const doneEditing = () => {
    setEditing(false);
  };
  const loading = useSelector((state) => state.messages.loading);

  const handleDeleteMessage = (event, messageId) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire(warningSwal({ confirmButtonText: 'DELETE' })).then((result) => {
      if (result.isConfirmed) dispatch(deleteMessage(queryId, messageId));
    });
  };

  const historyMessage = (name) =>
    name.includes(currentUser.full_name) && name.includes('has deleted a message')
      ? 'You have deleted a message'
      : name;

  if (loading) {
    return <Loading componentLoad />;
  }

  if (Object.keys(groupByDateMap).length !== 0) {
    const trackMessageOwner = [];

    return (
      <>
        <div className='message-group-container-scrollbox'>
          <div className='message-group-container'>
            <h4 className='print-message-name'>{messageData.name}</h4>
            {Object.keys(groupByDateMap).map((keyName) => (
              <div className='message-group' key={keyName}>
                <div className='message-group-date-wrapper'>
                  <div className='message-group-date'>
                    <span>{formatDateOnly(groupByDateMap[keyName][0].created_at)}</span>
                  </div>
                </div>
                {groupByDateMap[keyName].map((item) => {
                  if (item.type === 'Message') {
                    const itemCopy = { ...item };
                    trackMessageOwner.push(item.sender.id);
                    return (
                      <MessageItem
                        item={itemCopy}
                        key={itemCopy.id}
                        index={trackMessageOwner.length - 1}
                        trackMessageOwner={trackMessageOwner}
                        editMessage={handleEditMessage}
                        deleteMessage={handleDeleteMessage}
                        showArchived={showArchived}
                      />
                    );
                  }

                  trackMessageOwner.push(null);
                  return (
                    <div className='message-history' key={`${item.type}_${item.id}`}>
                      {historyMessage(item.name)}
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messageGroupEnd} />
          </div>
        </div>
        {!showArchived && canAddMessage && (
          <div className='message-box-wrapper'>
            <MessageBox
              showOptionsModal={showOptionsModal}
              messageData={messageData}
              queryId={queryId}
              currentUsers={currentUsers}
              editing={editing}
              doneEditing={doneEditing}
              currentFileAttachments={currentFileAttachments}
              setCurrentFileAttachmentsCallback={setCurrentFileAttachmentsCallback}
            />
          </div>
        )}
      </>
    );
  }

  return <MessageStart currentUsers={currentUsers} />;
};
