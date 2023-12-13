import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { LeftSidebar, RightSidebar, MessagingMiddle, UploadOptions } from './index';
import { Modal } from '../Modal';
import { DropzoneUploader } from '../DMS/FileUpload/Dropzone';
import { modalActions } from '../../../actions';
import { userOptionObj } from '../../../utils';
import { Loading } from '../Loading';

import './Message.module.scss';

const ActionCableConsumer = dynamic(
  import('react-actioncable-provider').then((mod) => mod.ActionCableConsumer),
  {
    ssr: false
  }
);

export const Message = ({
  queryId,
  query,
  messageRes,
  fetchMessages,
  archiveChatRoom,
  toggleArchived,
  onChangeShowAll,
  showAll,
  showArchived
}) => {
  const messageData = useSelector((state) => state.messages.items);
  const buildingProfile = useSelector((state) => state.buildingProfile);

  const [activeState, setActiveState] = useState(queryId || null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [dropzoneModal, setDropzoneModal] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState('');
  const [fileType, setFileType] = useState('text');
  const [newState, updateNewState] = useState();
  const [showMessagePreview, setMessagePreview] = useState(true);
  const [showMessageComponent, setMessageComponent] = useState(false);
  const [showDocumentPreview, setDocumentPreview] = useState(false);
  const [currentUsers, setCurrentUsers] = useState([]);

  const { createMessage } = query;
  const [currentFileAttachments, setCurrentFileAttachments] = useState();
  const currentChatroom = useSelector((state) => state.messages.currentItems);
  const currentMessages = currentChatroom.messages || [];
  const currentHistories = currentChatroom.histories || [];
  const dispatch = useDispatch();

  let attachedDocument = useSelector((state) => state.addAttachment.attachmentDetails);

  if (!attachedDocument.id) {
    attachedDocument = JSON.parse(window.localStorage.getItem('message_attachment')) || {};
    window.localStorage.removeItem('message_attachment');
  }

  const router = useRouter();

  useEffect(() => {
    updateNewState(messageData);
  }, [newState]);

  /**
   * Update the active state when the currentChatRoom is loaded via
   * the search bar
   */
  useEffect(() => {
    if (currentChatroom && currentChatroom.id !== activeState) {
      setActiveState(currentChatroom.id);
    }
  }, [currentChatroom]);

  useEffect(() => {
    if (createMessage) {
      router.replace(router.pathname, undefined, { shallow: true });
      showNewMessageModal();
    } else {
      setShowModal(false);
    }
  }, [createMessage]);

  useEffect(() => {
    return () => dispatch(modalActions.hideModal());
  }, []);

  const showNewMessageModal = () => {
    let initializedDocument;
    let initializedSubject;
    let initializedBuilding;
    let initializedUsers;

    if (attachedDocument.id) {
      initializedDocument = {
        label: attachedDocument.filename,
        value: attachedDocument.id,
        name: attachedDocument.filename,
        category: attachedDocument.category
      };

      initializedSubject = attachedDocument.creditorName
        ? `${attachedDocument.filename} - ${attachedDocument.creditorName.name}`
        : `${attachedDocument.filename}`;
    }

    if (attachedDocument.spNumber) {
      initializedBuilding = {
        label:
          attachedDocument.locations && attachedDocument.locations.length
            ? attachedDocument.locations[0].location_name
            : '',
        value: attachedDocument.spNumber,
        name: attachedDocument.spNumber,
        locations: attachedDocument.locations,
        can_message: attachedDocument.can_message
      };
    }

    if (attachedDocument.id || attachedDocument.users) {
      initializedUsers = attachedDocument.users.map(userOptionObj);
    }

    dispatch(
      modalActions.showModal('CHAT_ROOM', {
        initializedDocument,
        initializedBuilding,
        initializedSubject,
        initializedUsers,
        setActiveState
      })
    );
  };

  const showEditMessageModal = () => {
    const chatRoomAttachment = currentChatroom.attachments[0];
    const initializedDocument = currentChatroom?.attachments
      ? {
          value: chatRoomAttachment?.id,
          name: chatRoomAttachment?.filename,
          label: chatRoomAttachment?.filename
        }
      : {};
    const initializedBuilding = {
      label: currentChatroom.location.location_name,
      name: currentChatroom.account.site_plan_id,
      value: currentChatroom.account.site_plan_id,
      locations: [currentChatroom.location]
    };

    const initializedUsers = currentChatroom.users ? currentChatroom.users.map(userOptionObj) : [];

    dispatch(
      modalActions.showModal('CHAT_ROOM', {
        chatRoomId: currentChatroom?.id,
        initializedDocument,
        initializedBuilding,
        initializedUsers,
        initializedSubject: currentChatroom.name,
        setActiveState
      })
    );
  };

  if (!messageData) return null;

  // Closes modal and child component
  const closeModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(false);
    setDropzoneModal(false);
    setOptionsModal(false);
  };

  // Checks which type of component to display within modal
  const getModalComponent = () => {
    if (optionsModal) {
      return (
        <UploadOptions
          closeModal={closeModal}
          setAcceptedFiles={setAcceptedFiles}
          setFileType={setFileType}
          setModalTitle={setModalTitle}
          showDropzoneModal={showDropzoneModal}
        />
      );
    }

    if (dropzoneModal) {
      return (
        <div className='file-upload-container'>
          <p className='title'>Upload {fileType}</p>
          <DropzoneUploader
            addFileHandler={addFileHandler}
            acceptedFiles={acceptedFiles}
            allowMultiple
          />
        </div>
      );
    }

    return null;
  };

  // Toggles dropzone uploader component within modal
  const showDropzoneModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(true);
    if (!dropzoneModal) {
      setDropzoneModal(true);
    }
  };

  const showOptionsModal = (event) => {
    if (event) event.preventDefault();
    setShowModal(true);

    if (!optionsModal) {
      setOptionsModal(true);
    }
  };

  const addFileHandler = async (base64, details) => {
    try {
      const { id } = currentChatroom;
      const arrayOfFiles = base64?.map((file, index) => ({
        file: file,
        filename: details[index].name
      }));
      setCurrentFileAttachments(arrayOfFiles);
      closeModal();
      return null;
    } catch (error) {
      console.error('Error adding file', error);
    }
  };

  const setCurrentFileAttachmentsCallback = (files) => {
    setCurrentFileAttachments(files);
  };

  // Shows message component on message preview click
  const showMobileMessage = () => {
    setMessagePreview(false);
    setDocumentPreview(false);
    setMessageComponent(true);
  };

  // Shows message preview component on button click
  const showMobilePreview = () => {
    setDocumentPreview(false);
    setMessageComponent(false);
    setMessagePreview(true);
  };

  // Shows document/job/invoice component on button click
  const showMobileDocument = () => {
    setMessageComponent(false);
    setMessagePreview(false);
    setDocumentPreview(true);
  };

  const handlePrint = () => {
    const masqueradeBar = document.getElementById('masquerade_bar');
    window.onbeforeprint = () => {
      if (masqueradeBar) {
        masqueradeBar.classList.add('hidden');
      }
    };
    window.onafterprint = () => {
      if (masqueradeBar) {
        masqueradeBar.classList.remove('hidden');
      }
    };
    window.print();
  };

  return (
    <div className='messages-container-wrapper'>
      <div className={`messaging-sidebar-container ${showMessagePreview ? 'active' : 'inactive'}`}>
        <ActionCableConsumer channel={{ channel: 'ChatRoomsChannel' }} />
        <LeftSidebar
          messageData={messageData}
          activeState={parseInt(activeState, 10)}
          setActiveState={setActiveState}
          showNewMessageModal={showNewMessageModal}
          showMobileMessage={showMobileMessage}
          showMessagePreview={showMessagePreview}
          setModalTitle={setModalTitle}
          messageRes={messageRes}
          fetchMessages={fetchMessages}
          setCurrentUsers={setCurrentUsers}
          currentUsers={currentUsers}
          archiveChatRoom={archiveChatRoom}
          toggleArchived={toggleArchived}
          onChangeShowAll={onChangeShowAll}
          showAll={showAll}
          showArchived={showArchived}
          queryId={queryId}
          buildingProfile={buildingProfile}
        />
      </div>
      {!messageRes.currentItemsLoading && (
        <div
          className={`messaging-middle-container ${showMessageComponent ? 'active' : 'inactive'}`}
        >
          <div
            className={`mobile-messaging-navbar ${showMessageComponent ? 'active' : 'inactive'}`}
          >
            <button
              type='button'
              onClick={showMobilePreview}
              className='icon icon-chevron-down-dark back-button'
            >
              Chats
            </button>
            <button
              type='button'
              onClick={showMobileDocument}
              className={`icon-after icon-chevron-down-dark show-document-button ${
                activeState !== null ? 'active' : 'inactive'
              }`}
            >
              View document
            </button>
          </div>

          {activeState !== null ? (
            <MessagingMiddle
              currentMessages={currentMessages}
              currentHistories={currentHistories}
              currentUsers={currentUsers}
              messageData={currentChatroom}
              showOptionsModal={showOptionsModal}
              queryId={queryId}
              showArchived={showArchived}
              currentFileAttachments={currentFileAttachments}
              setCurrentFileAttachmentsCallback={setCurrentFileAttachmentsCallback}
            />
          ) : (
            <div className='no-message-clicked'>
              <strong>No message selected</strong>
            </div>
          )}
        </div>
      )}

      {!messageRes.currentItemsLoading && (
        <RightSidebar
          docUrl={
            currentChatroom.attachments &&
            currentChatroom.attachments[0] &&
            currentChatroom.attachments[0].links &&
            currentChatroom.attachments[0].links.file_url
          }
          documentData={currentChatroom}
          showMobileMessage={showMobileMessage}
          showDocumentPreview={showDocumentPreview}
          showArchived={showArchived}
          showEditMessageModal={showEditMessageModal}
          handlePrint={handlePrint}
        />
      )}

      {messageRes.currentItemsLoading && (
        <div className='loading-container'>
          <Loading componentLoad />
        </div>
      )}

      <Modal
        active={showModal}
        closeModal={closeModal}
        className='dropzone-modal'
        title={modalTitle}
      >
        {getModalComponent()}
      </Modal>
    </div>
  );
};
