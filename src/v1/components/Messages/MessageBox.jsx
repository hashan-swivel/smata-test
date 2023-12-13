import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MentionsInput, Mention } from 'react-mentions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../../utils';
import { Avatar } from '../Avatar';
import defaultMessageBoxStyle from './defaultMessageBoxStyle';
import { FileType } from '../index';
import { updateDraftMessages } from '../../../actions/messages';

import './MessageBox.module.scss';

let container;

export const MessageBox = ({
  currentUsers,
  doneEditing,
  editing,
  queryId,
  showOptionsModal,
  currentFileAttachments,
  setCurrentFileAttachmentsCallback
}) => {
  const inputRef = useRef(null);
  const [currentText, setCurrentText] = useState('');
  const [currentFiles, setCurrentFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const drafts = useSelector((state) => state.messages.draftMessages);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentFileAttachments) setCurrentFiles(currentFileAttachments);
  }, [currentFileAttachments]);

  useEffect(() => {
    if (editing && editing.id) {
      setCurrentText(editing.value.replace(/<br\s*[\/]?>/gi, '\n'));
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    if (inputRef.current.value)
      dispatch(updateDraftMessages({ id: queryId, message: inputRef.current.value }));
  }, []);

  useEffect(() => {
    if (drafts) {
      const dm = drafts.find((x) => x.id === queryId);
      if (dm && inputRef.current.value === '') {
        setCurrentText(dm.message);
      }
    }
  }, [queryId]);

  const users = currentUsers?.map((user) => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    display: `${user.first_name} ${user.last_name}`
  }));

  const postMessage = async (id, body) => {
    const _body = body.replace(/(?:\r\n|\r|\n)/g, '<br />');
    setIsSending(true);
    if (editing && editing.id) {
      await axiosInstance.patch(`/v1/chat_rooms/${id}/messages/${editing.id}?body=${_body}`);
      doneEditing();
    } else {
      const postBody = {
        body: _body,
        message_files_attributes: currentFiles
      };
      await axiosInstance.post(`/v1/chat_rooms/${id}/messages`, postBody);
    }
    setIsSending(false);
    setCurrentText('');
    setCurrentFiles([]);
    setCurrentFileAttachmentsCallback([]);
    dispatch(updateDraftMessages({ id, message: '' }));
  };

  const handleTextChange = (e) => {
    setCurrentText(e.target.value);
  };

  const mentionInputStyle = Object.assign({}, defaultMessageBoxStyle, {
    input: {
      overflow: 'auto',
      height: 70
    },
    highlighter: {
      boxSizing: 'border-box',
      overflow: 'hidden',
      height: 70
    }
  });

  const getFileExt = (filename) => {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  };

  const deletePreviewAttachment = (e, filename) => {
    e.preventDefault();
    if (currentFiles && currentFiles.length > 0) {
      const updatedCurrentFiles = currentFiles.filter((file) => file.filename !== filename);
      setCurrentFiles(updatedCurrentFiles);
      setCurrentFileAttachmentsCallback(updatedCurrentFiles);
    }
  };

  return (
    <div
      className='write-message-container'
      ref={(el) => {
        container = el;
      }}
    >
      <MentionsInput
        className='message-textarea'
        placeholder='Write a message...'
        value={currentText}
        onChange={handleTextChange}
        suggestionsPortalHost={container}
        inputRef={inputRef}
        style={mentionInputStyle}
        allowSuggestionsAboveCursor
      >
        <Mention
          trigger='@'
          data={users}
          markup={'<span class="mention">@__display__</span>'}
          renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
            <div className={`react-mention-item ${focused ? 'focused' : null}`}>
              <Avatar {...suggestion} size='xsmall' />
              <span className='react-mention-name' style={{ marginLeft: '5px' }}>
                {highlightedDisplay}
              </span>
            </div>
          )}
          displayTransform={(display) => `@${display}`}
          onAdd={() => {
            // refocus to move the cursor to the end of the input after a mention is added
            inputRef.current.blur();
            inputRef.current.focus();
          }}
        />
      </MentionsInput>
      {currentFiles.length !== 0 && (
        <div className='preview-current-files'>
          {currentFiles.map((file, index) => (
            <div key={index} className='preview-current-file'>
              <FileType type={getFileExt(file.filename)} />
              <FontAwesomeIcon
                icon={faTimesCircle}
                onClick={(e) => deletePreviewAttachment(e, file.filename)}
                size='sm'
                className='preview-attachment-remove-btn'
              />
            </div>
          ))}
        </div>
      )}
      <div className='message-box-action-buttons-wrapper'>
        <button
          type='button'
          className='button message-box-attach-file'
          onClick={() => showOptionsModal()}
          disabled={isSending}
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
        <button
          type='button'
          className='button message-send-button'
          onClick={() => postMessage(queryId, currentText)}
          disabled={(currentText.length === 0 && currentFiles.length === 0) || isSending}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};
