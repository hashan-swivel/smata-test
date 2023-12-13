import queryString from 'query-string';
import Router from 'next/router';
import ZipInstance from 'jszip';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import {
  GET_CURRENT_MESSAGES,
  GET_CURRENT_MESSAGES_SUCCESS,
  GET_FILTERED_MESSAGES_SUCCESS,
  GET_MESSAGES,
  GET_MESSAGES_ERROR,
  GET_MESSAGES_SEARCH,
  GET_MESSAGES_SEARCH_SUCCESS,
  GET_MESSAGES_SUCCESS,
  ARCHIVE_CHAT_ROOM,
  DELETE_MESSAGE,
  SEND_MESSAGE,
  NEW_MESSAGE,
  SEND_NEW_OWN_MESSAGE,
  ADD_NEW_CONVERSATION,
  SET_MESSAGES_LOADING,
  SET_MESSAGES_SEARCH_VALUE,
  SET_CONVERSATION_FIELD,
  BROADCAST_DELETE_MESSAGE,
  UPDATE_DRAFT_MESSAGE
} from './types';
import { unreadMessageStatus } from './notifications';
import { axiosInstance, chunk } from '../utils';
import { flashActions } from './flash';
import MessagePDFDoc from '../components/v1/Messages/MessagePDFDoc';
import { flashConstants } from '../constants';

export const getMessages =
  ({ page = 1, showArchived, showAll }) =>
  async (dispatch, getState) => {
    try {
      // Do not fetch same page twice
      const state = getState();
      const currentPage = state?.messages?.meta?.page;
      const isArchived = state?.messages?.view === 'archived';
      const isShowAll = state?.message?.showAll;
      if (
        currentPage &&
        currentPage >= page &&
        isArchived === showArchived &&
        isShowAll === showAll
      )
        return null;

      let filters = {};
      let searchFilters = state.messages.searchFilters;
      searchFilters.forEach((sf) => {
        let key = sf.type;
        if (key === 'type') key = 'category';
        if (key === 'tag') key = 'tags';
        if (key === 'amounts') key = 'amount';
        filters[key] = sf.item;
      });

      const query = queryString.stringify({
        ...page,
        ...filters,
        show_all: showAll,
        attachments: true,
        last_message: true,
        location: true,
        per_page: 20,
        unread_count: true,
        users: true
      });

      // Initial loading if first page, do not show for paginated requests
      dispatch({ type: GET_MESSAGES, showLoading: page === 1 });
      const apiUrl = `/v1/chat_rooms${showArchived ? '/archived_chat_rooms' : ''}`;
      const { data } = await axiosInstance.get(`${apiUrl}?${query}`);
      const view = showArchived ? 'archived' : 'unarchived';
      // Return data for reducer to push to end of existing items or add to empty arr if first page
      dispatch({
        type: GET_MESSAGES_SUCCESS,
        payload: { ...data, view, showAll }
      });
      await dispatch(unreadMessageStatus());
    } catch (error) {
      // Handle error
      dispatch({
        type: GET_MESSAGES_ERROR,
        error
      });
    }
  };

export const getCurrentMessages = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_CURRENT_MESSAGES });
    await axiosInstance.patch(`/v1/chat_rooms/${id}/read_messages`);
    const { data } = await axiosInstance.get(
      `/v1/chat_rooms/${id}?users=true&attachments=true&location=true&messages=true&account=true&unread_count=true`
    );
    dispatch({
      type: GET_CURRENT_MESSAGES_SUCCESS,
      payload: data
    });
    // Wipe unread messages badge from header
    await dispatch(unreadMessageStatus());
  } catch (error) {
    dispatch({
      type: GET_MESSAGES_ERROR,
      error
    });
    dispatch(flashActions.showError(error));
  }
};

export const archiveChatRoom = (id, items, activeId, isArchived) => async (dispatch) => {
  try {
    dispatch({ type: GET_MESSAGES, showLoading: false });
    const chatRooms = [...items];
    const deletedChatRoom = chatRooms.find((item) => item.id === id);
    const indexOfDeleted = chatRooms.indexOf(deletedChatRoom);
    chatRooms.splice(indexOfDeleted, 1);
    const apiUrl = isArchived ? `v1/chat_rooms/${id}/restore` : `/v1/chat_rooms/${id}`;
    const apiMethod = isArchived ? 'put' : 'delete';
    await axiosInstance[apiMethod](apiUrl);

    dispatch({
      type: ARCHIVE_CHAT_ROOM,
      payload: chatRooms
    });

    if (id === activeId) Router.push(`/messages?id=${chatRooms[0].id}`);
  } catch (error) {
    console.log('error @archiveChatRoom', error);
    dispatch({
      type: GET_MESSAGES_ERROR,
      error
    });
  }
};

export const deleteMessage = (chatroomId, messageId) => async (dispatch, getState) => {
  await axiosInstance
    .delete(`/v1/chat_rooms/${chatroomId}/messages/${messageId}`)
    .then(() => {
      // TODO: no need to use getState
      const { messages } = getState();
      const { currentItems } = messages;
      const { messages: currentMessages } = currentItems;
      const updatedCurrentMessages = currentMessages.map((message) => ({
        ...message,
        is_deleted: message.id === messageId || message.is_deleted
      }));
      dispatch({ type: DELETE_MESSAGE, payload: updatedCurrentMessages });
      dispatch(flashActions.showSuccess('Message has been deleted'));
    })
    .catch((error) => dispatch(flashActions.showError(error)));
};

export const sendMessage = (payload) => (dispatch) => {
  dispatch({
    type: SEND_MESSAGE,
    payload
  });
};

export const newMessage = (payload) => (dispatch) => {
  dispatch({
    type: NEW_MESSAGE,
    payload
  });
};

export const setConversationField = (payload) => (dispatch) => {
  dispatch({
    type: SET_CONVERSATION_FIELD,
    payload
  });
};

export const sendNewOwnMessage = (payload) => (dispatch) => {
  dispatch({
    type: SEND_NEW_OWN_MESSAGE,
    payload
  });
};

export const broadcastDeleteMessage = (payload) => (dispatch) => {
  dispatch({
    type: BROADCAST_DELETE_MESSAGE,
    payload
  });
};

export const setMessagesLoading = (payload) => (dispatch) => {
  dispatch({
    type: SET_MESSAGES_LOADING,
    payload
  });
};

export const setFilteredItems = (payload) => (dispatch) => {
  dispatch({
    type: GET_FILTERED_MESSAGES_SUCCESS,
    payload
  });
};

export const setFilters = (payload) => (dispatch) => {
  dispatch({
    type: SET_MESSAGES_SEARCH_VALUE,
    payload
  });
};

export const addNewConversation = (payload) => (dispatch) => {
  dispatch({
    type: ADD_NEW_CONVERSATION,
    payload
  });
};

export const updateDraftMessages = (draftMsg) => (dispatch) => {
  dispatch({
    type: UPDATE_DRAFT_MESSAGE,
    payload: draftMsg
  });
};

export const bulkDownloadMessages =
  (selectedIds, currentUsers, buildingProfile, currentUser) => async (dispatch) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      text: `Generating download of ${selectedIds.length} conversations, please wait for it to complete`,
      didOpen(popup) {
        MySwal.showLoading();
      },
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    let result = [];
    const zip = new ZipInstance();
    try {
      const downloadAndZipChat = async (id) => {
        await axiosInstance
          .get(
            `/v1/chat_rooms/${id}?users=true&attachments=true&location=true&messages=true&account=true`
          )
          .then((res) => {
            const chatRoom = {
              ...res.data,
              unread_count: 0
            };

            const doc = (
              <MessagePDFDoc
                chatRoom={chatRoom}
                buildingProfile={buildingProfile}
                currentUser={currentUser}
                currentUsers={currentUsers}
              />
            );

            zip.file(`${chatRoom.name.replace('/', '|')}.pdf`, pdf(doc).toBlob(), {
              binary: true,
              mimeType: 'text/plain; charset=x-user-defined'
            });

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
        await Promise.all(batch.map((promiseItem) => downloadAndZipChat(promiseItem)));
      }
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'SMATA conversations.zip');

      if (
        result.length === 0 ||
        result.every((item) => item.bulkMessageSuccess && item.bulkMessageSuccess === 'success')
      ) {
        dispatch(flashActions.showSuccess('All selected conversations downloaded successfully.'));
      } else {
        dispatch(flashActions.showError('Some of the selected coversations failed to download.'));
      }
    } catch (error) {
      dispatch(flashActions.showError(error));
    } finally {
      MySwal.close();
    }
  };

export const bulkDownloadAllMessages =
  (currentUsers, buildingProfile, currentUser) => async (dispatch) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      text: 'Generating the download of all the conversations, please wait for it to complete',
      didOpen(popup) {
        MySwal.showLoading();
      },
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    try {
      let currentPage = 1;
      let totalPages = 0;
      let allChatIds = [];

      // download all the chat ids
      do {
        // eslint-disable-next-line no-await-in-loop
        const chats = await axiosInstance.get(
          `/v1/chat_rooms?per_page=20&page=${currentPage}&last_message=false&attachments=false&users=false&location=false&unread_count=false`
        );
        allChatIds = allChatIds.concat(chats.data.chat_rooms.map((chat) => chat.id));
        totalPages = chats.data.meta.total_pages;
        currentPage += 1;
      } while (currentPage <= totalPages);

      // download all messages
      dispatch(bulkDownloadMessages(allChatIds, currentUsers, buildingProfile, currentUser));
    } catch (error) {
      dispatch(flashActions.showError(error));
      MySwal.close();
    }
  };
