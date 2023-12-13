import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import uniqBy from 'lodash/uniqBy';
import loadingIcon from '../../../images/loading-tail-spin.svg';
import { Toggle } from '../Form/Fields/Toggle';
import { Search } from '../Search';
import { ConversationPreview } from './ConversationPreview';
import { postAlert } from '../../../actions/alerts';
import { axiosInstance, chunk } from '../../../utils';
import { flashActions } from '../../../actions';
import { DropDown } from '../DropDown';
import {
  sendNewOwnMessage,
  setFilteredItems,
  setFilters,
  broadcastDeleteMessage,
  bulkDownloadMessages,
  bulkDownloadAllMessages
} from '../../../actions/messages';

import './LeftSidebar.module.scss';

const ActionCableConsumer = dynamic(
  import('react-actioncable-provider').then((mod) => mod.ActionCableConsumer),
  {
    ssr: false
  }
);

export const LeftSidebar = ({
  activeState,
  archiveChatRoom,
  fetchMessages,
  messageRes,
  onChangeShowAll,
  queryId,
  currentUsers,
  setActiveState,
  setCurrentUsers,
  showAll,
  showArchived,
  showNewMessageModal,
  showMessagePreview,
  showMobileMessage,
  toggleArchived,
  buildingProfile
}) => {
  const [focused, setFocused] = useState(false);
  const currentChatroom = useSelector((state) => state.messages.currentItems);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const searchFilters = useSelector((state) => state.messages.searchFilters);
  const { meta: pagination, items } = messageRes;
  const { page, total_pages: totalPages } = pagination;
  const reachedEnd = page === totalPages;
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAllChat, setSelectedAllChat] = useState(false);

  const canViewAll = currentUser?.isStrataManager || currentUser?.isOrganisationAdmin;
  const canAddChatRoom = currentUser && !currentUser.isBuildingInspector;
  const selectable = currentUser?.isTenantManager;

  const handleFetchMore = (event) => {
    event.preventDefault();
    if (!messageRes.fetchingMore) {
      fetchMessages({ page: page + 1 });
    }
  };

  const handleArchiveChatRoom = (event, id) => {
    event.preventDefault();
    const confirmMessage = `Are you sure you want to ${
      showArchived ? 'unarchive' : 'archive'
    } this conversation?`;
    const confirm = window.confirm(confirmMessage);

    if (confirm) {
      dispatch(archiveChatRoom(id, items, queryId, showArchived));
      dispatch(postAlert(`Conversation ${showArchived ? 'unarchived' : 'archived'}`, 'success'));
    }
  };

  const onSelectionChange = (event, uid) => {
    const selectedArr = [...selectedIds];
    const indexOfSelected = selectedArr.indexOf(uid);
    if (indexOfSelected !== -1) {
      selectedArr.splice(indexOfSelected, 1);
    } else {
      selectedArr.push(uid);
    }
    setSelectedAllChat(selectedArr?.length === messageRes?.items.length);
    setSelectedIds(selectedArr);
  };

  const handleMarkRead = async () => {
    let result = [];
    const updateMessageAsRead = async (messageId) => {
      await axiosInstance
        .patch(`/v1/chat_rooms/${messageId}/read_messages`)
        .then((res) => {
          result = [
            ...result,
            {
              bulkMessageSuccess: 'success'
            }
          ];
        })
        .catch((err) => {
          result = [...result, { bulkMessageError: flashActions.errorMessage(err) }];
        });
    };

    const batches = chunk(selectedIds, 5); // [[item1, item2, ..., item15], [item16, ..., item30]]

    while (batches.length) {
      const batch = batches.shift();
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map((promiseItem) => updateMessageAsRead(promiseItem)));
    }
    if (
      result.length === 0 ||
      result.every((item) => item.bulkMessageSuccess && item.bulkMessageSuccess === 'success')
    ) {
      dispatch(flashActions.showSuccess('All selected messages marked as read successfully.'));
    } else {
      dispatch(flashActions.showError('Some of the selected messages marked as read failed.'));
    }
  };

  const handleBulkDownloadSelectedChats = () => {
    dispatch(bulkDownloadMessages(selectedIds, currentUsers, buildingProfile, currentUser));
  };

  const handleBulkDownloadAllChats = () => {
    dispatch(bulkDownloadAllMessages(currentUsers, buildingProfile, currentUser));
  };

  const onSelectAllChatMessages = () => {
    setSelectedIds(!selectedAllChat ? messageRes.items.map((message) => message.id) : []);
    setSelectedAllChat(!selectedAllChat);
  };

  const bulkActions = () => [
    { label: 'Mark selected chats as read', onClick: handleMarkRead },
    { label: 'Download selected chats', onClick: handleBulkDownloadSelectedChats },
    { label: 'Download all chats', onClick: handleBulkDownloadAllChats }
  ];

  return (
    messageRes && (
      <>
        <div className='close-preview-button-container'>
          <button
            type='button'
            onClick={showMobileMessage}
            className={`icon-after icon-chevron-down-dark show-message-content-button ${
              showMessagePreview ? 'active' : 'inactive'
            }`}
          >
            View messages
          </button>
        </div>
        <div className='message-sidebar-search-box'>
          <Search
            searchFilters={searchFilters}
            setFilteredItems={setFilteredItems}
            setFilters={setFilters}
            type='messages'
            apiUrl='messages'
            showAll={showAll}
            showArchived={showArchived}
          />
          {canAddChatRoom && (
            <button
              type='button'
              className='button button-primary new-msg-button icon icon-add-white'
              onClick={() => showNewMessageModal()}
            />
          )}
        </div>
        <div className='message-sidebar-filter-togglers'>
          {selectable && (
            <div className='checkboxes-field'>
              <div className='option'>
                <input
                  id='chat-message-select-all'
                  name='chat_message_select_all'
                  onChange={() => onSelectAllChatMessages()}
                  checked={selectedAllChat}
                  type='checkbox'
                />
                <label htmlFor='chat-message-select-all' title='Select mark all messages read' />
              </div>
            </div>
          )}
          {selectedIds.length > 0 && <DropDown label='Bulk Actions' options={bulkActions()} />}
          <Toggle onChange={toggleArchived} checked={showArchived} label='Show Archived' />
          {canViewAll && <Toggle onChange={onChangeShowAll} checked={showAll} label='Show All' />}
        </div>
        <div className='chatroom-filter-result-container'>
          {uniqBy(messageRes.items, 'id')
            .sort((b, a) => a.last_message?.id - b.last_message?.id)
            .map((_item, index, array) => {
              // Grab the id in messages page and pass to component
              // const reverseIndex = array.length - 1 - index;
              const item = array[index];
              if (item.id === currentChatroom.id) {
                return (
                  <ActionCableConsumer
                    key={`item-${index}`}
                    channel={{ channel: 'MessagesChannel', chat_room_id: item.id }}
                    onReceived={(e) => {
                      if (e.event === 'delete') {
                        dispatch(
                          broadcastDeleteMessage({
                            conversation_id: item.id,
                            messageData: { ...e.message }
                          })
                        );
                      } else {
                        dispatch(
                          sendNewOwnMessage({
                            conversation_id: item.id,
                            messageData: { ...e.message },
                            unread: item.id !== currentChatroom.id,
                            isUpdateCurrent: false
                          })
                        );
                      }
                    }}
                  >
                    <ConversationPreview
                      key={item.id}
                      messageData={item}
                      index={index}
                      activeState={activeState}
                      setActiveState={setActiveState}
                      showMobileMessage={showMobileMessage}
                      setCurrentUsers={setCurrentUsers}
                      archiveChatRoom={handleArchiveChatRoom}
                      showArchived={showArchived}
                      selectable={selectable}
                      selectedIds={selectedIds}
                      onSelectionChange={onSelectionChange}
                    />
                  </ActionCableConsumer>
                );
              }

              return (
                <ConversationPreview
                  key={item.id}
                  messageData={item}
                  index={index}
                  activeState={activeState}
                  setActiveState={setActiveState}
                  showMobileMessage={showMobileMessage}
                  setCurrentUsers={setCurrentUsers}
                  archiveChatRoom={handleArchiveChatRoom}
                  showArchived={showArchived}
                  selectable={selectable}
                  selectedIds={selectedIds}
                  onSelectionChange={onSelectionChange}
                />
              );
            })}

          {messageRes.fetchingMore && (
            <div className='messages-fetch-more'>
              <img src={loadingIcon} alt='Fetching more' />
            </div>
          )}
          {!reachedEnd && !messageRes.fetchingMore && (
            <div className='messages-fetch-more'>
              <button type='button' className='button button-primary' onClick={handleFetchMore}>
                {messageRes.fetchingMore ? 'Fetching' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </>
    )
  );
};
