import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import moment from 'moment';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faExternalLinkAlt,
  faTimes,
  faUndoAlt
} from '@fortawesome/free-solid-svg-icons';
import { modalActions } from '../../../actions';
import { Loading } from '../Loading';
import { documentConstants, shareConstants } from '../../../constants';

import './DocumentPreviewModal.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const documentPreviewModalStyles = {
  content: {
    position: 'relative',
    inset: '0px',
    border: 'none',
    background: 'transparent',
    WebkitOverflowScrolling: 'touch',
    outline: 'none',
    padding: 0,
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto'
  }
};

const DocumentPreviewModal = ({
  fileUrl,
  filename,
  fileExtension,
  fileSize,
  addedDate,
  documentUrl,
  dispatch
}) => {
  const [rotation, setRotation] = useState(0);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumPages] = useState(1);
  const extension = fileExtension
    ? fileExtension.toLowerCase()
    : filename
      ? /(?:\.([^.]+))?$/.exec(filename)[1].toLowerCase()
      : '';

  useEffect(() => {
    // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
    if (typeof window !== 'undefined') ReactModal.setAppElement(shareConstants.ROOT_ID);
  }, []);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const rotate = (e) => {
    e.stopPropagation();
    setRotation(rotation === 270 ? 0 : rotation + 90);
  };

  const onNextButton = () => {
    if (page < numOfPages) {
      setPage(page + 1);
    }
  };

  const onBackButton = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const closeModal = () => {
    dispatch(modalActions.hideModal());
  };

  const renderPreview = () => {
    if (extension === 'pdf') {
      return (
        <TransformWrapper defaultScale={1} wheel={{ wheelEnabled: true }}>
          <TransformComponent>
            <Document
              file={fileUrl}
              loading={<Loading componentLoad />}
              error={<span className='error-msg'>FAILED TO LOAD</span>}
              onPassword={() => undefined}
              onLoadSuccess={onLoadSuccess}
            >
              <Page
                pageNumber={page}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                rotate={rotation}
              />
            </Document>
          </TransformComponent>
        </TransformWrapper>
      );
    }

    if (documentConstants.IMAGE_PREVIEWABLE_TYPES.includes(extension)) {
      return (
        <TransformWrapper defaultScale={1} wheel={{ wheelEnabled: true }}>
          <TransformComponent>
            <img src={fileUrl} alt={filename} style={{ transform: `rotate(${rotation}deg)` }} />
          </TransformComponent>
        </TransformWrapper>
      );
    }

    if (documentConstants.MS_OFFICE_PREVIEWABLE_TYPES.includes(extension)) {
      return (
        <iframe
          className='other-embedded-view-content'
          frameBorder='0'
          title='MS office embedded iframe'
          style={{ transform: `rotate(${rotation}deg)`, minHeight: '70vh' }}
          src={`${documentConstants.MS_OFFICE_WEB_VIEWER}?src=${fileUrl}&rs=${navigator.language}&ui=${navigator.language}`}
        />
      );
    }

    return <h3 className='error-msg'>PREVIEW IS NOT AVAILABLE</h3>;
  };

  return (
    <ReactModal
      isOpen
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      style={documentPreviewModalStyles}
      className='modal dms-preview-modal'
      ariaHideApp={false}
      onRequestClose={closeModal}
    >
      <div className='dms-preview-modal-content'>{renderPreview()}</div>

      <div className='dms-preview-footer'>
        {numOfPages > 1 && (
          <div className='dms-preview-footer-pagination'>
            <button
              type='button'
              onClick={() => onBackButton()}
              className='dms-preview-footer-pagination--previous'
              title='Back'
              disabled={!(page <= numOfPages && page !== 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span style={{ lineHeight: 0 }}>
              PAGE {page} / {numOfPages}
            </span>
            <button
              type='button'
              onClick={() => onNextButton()}
              className='dms-preview-footer-pagination--next'
              title='Next'
              disabled={!(page < numOfPages)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
        <h4>{filename}</h4>
        <span className='file-info'>
          {addedDate && `Added ${moment.unix(addedDate).format('DD/MM/YYYY')} - `}
          {fileSize && fileSize}
        </span>
        <div className='dms-preview-footer-actions'>
          {documentUrl && (
            <a
              href={documentUrl}
              target='_blank'
              rel='noopener noreferrer'
              tabIndex='-1'
              title='Open in new tab'
              className='dms-preview-footer-action'
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className='btn-icon' />
              Open in new tab
            </a>
          )}
          <a
            onClick={rotate}
            role='button'
            tabIndex='-1'
            title='Rotate'
            className='dms-preview-footer-action'
          >
            <FontAwesomeIcon icon={faUndoAlt} flip='vertical' className='btn-icon' />
            Rotate
          </a>
          <a
            role='button'
            tabIndex='-1'
            title='Close'
            onClick={closeModal}
            className='dms-preview-footer-action'
          >
            <FontAwesomeIcon icon={faTimes} className='btn-icon' />
            Close
          </a>
        </div>
      </div>
    </ReactModal>
  );
};

export default connect((state) => state.modal)(DocumentPreviewModal);
