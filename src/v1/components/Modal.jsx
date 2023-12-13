import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import './Modal.module.scss';

const appRoot = typeof window !== 'undefined' ? document.getElementById('__next') : null;

export const Modal = (props) => {
  const {
    active,
    closeModal,
    children,
    className,
    warnBeforeClose,
    title,
    type,
    setContinueModal
  } = props;

  const [mounted, setMounted] = useState(false);

  const fileUploadState = useSelector((state) => state.form.files);
  const { values } = fileUploadState || {};

  const onUnload = (event) => {
    // eslint-disable-next-line
    if (warnBeforeClose && event) event.returnValue = 'Are you sure?';
  };

  const handleEscKey = (event) => {
    if (event.keyCode === 27 && closeModal) {
      if (fileUploadState) {
        setContinueModal(true);
      }
      return closeModal(event);
    }
  };

  const handleModalBackgroundClick = (event) => {
    if (!event || !event.target || !closeModal) return null;
    const { className: clickedClassName } = event.target;
    if (
      clickedClassName &&
      typeof clickedClassName === 'string' &&
      clickedClassName.indexOf('modal ') !== -1
    ) {
      if (type === 'uploader' && values.file.length >= 1) {
        setContinueModal(true);
      }
      return closeModal(event);
    }
    return null;
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey, false);
    window.addEventListener('beforeunload', onUnload);
    setMounted(true);
    return () => {
      document.removeEventListener('keydown', handleEscKey, false);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  if (!active || !mounted) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal ${className || ''}`}
      onClick={(event) => handleModalBackgroundClick(event)}
      role='dialog'
    >
      <div className={`modal-content ${title ? 'custom-title' : ''}`}>
        <div className={`modal-title-close ${title ? 'title' : 'no-title'}`}>
          {title ? <h3 className='modal-title'>{title}</h3> : null}
          <a href='#close' onClick={closeModal}>
            <span
              className={`icon icon-cross-${title ? 'white' : 'dark'} modal-cross-close ${
                title ? 'custom-title' : ''
              }`}
            ></span>
          </a>
        </div>
        {children}
      </div>
    </div>,
    appRoot
  );
};
