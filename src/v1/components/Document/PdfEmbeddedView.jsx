import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  faChevronLeft,
  faChevronRight,
  faExpandArrowsAlt,
  faSearchMinus,
  faSearchPlus,
  faUndoAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading } from '../Loading';

import './PdfEmbeddedView.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};

export const PdfEmbeddedView = ({ url, handleExpandClicked }) => {
  const [page, setPage] = useState(1);
  const [numOfPages, setNumPages] = useState(1);
  const [pageRotation, setPageRotation] = useState(0);
  const PageScale = window.innerWidth <= 600 ? 1.0 : 2.0;

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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

  const onRotateButton = () => {
    setPageRotation(pageRotation === 270 ? 0 : pageRotation + 90);
  };

  function onPassword(callback, reason) {
    function callbackProxy(password) {
      // Cancel button handler
      if (password === null) {
        return;
        // Reset your `document` in `state`, un-mount your `<Document />`, show custom message, whatever
      }

      callback(password);
    }

    switch (reason) {
      case PasswordResponses.NEED_PASSWORD: {
        const password = prompt('Enter the password to open this PDF file.');
        callbackProxy(password);
        break;
      }
      case PasswordResponses.INCORRECT_PASSWORD: {
        const password = prompt('Invalid password. Please try again.');
        callbackProxy(password);
        break;
      }
      default:
    }
  }

  return (
    <div className='pdf-embedded-view-wrapper'>
      <Document
        file={url}
        onLoadSuccess={onLoadSuccess}
        loading={<Loading componentLoad />}
        onPassword={onPassword}
      >
        <TransformWrapper
          defaultScale={1}
          defaultPositionX={200}
          defaultPositionY={100}
          wheel={false}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <div className='pdf-embedded-view-container'>
              <div className='pdf-embedded-view-header'>
                <div className='pdf-embedded-view-pagination'>
                  <button
                    type='button'
                    onClick={() => onBackButton()}
                    className='pdf-embedded-view-pagination--previous'
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
                    className='pdf-embedded-view-pagination--next'
                    title='Next'
                    disabled={!(page < numOfPages)}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
                <div className='pdf-embedded-view-tools'>
                  <button
                    onClick={zoomIn}
                    type='button'
                    title='Zoom In'
                    className='pdf-embedded-view-tools--zoom-in'
                  >
                    <FontAwesomeIcon icon={faSearchPlus} />
                  </button>
                  <button
                    onClick={zoomOut}
                    type='button'
                    title='Zoom Out'
                    className='pdf-embedded-view-tools--zoom-out'
                  >
                    <FontAwesomeIcon icon={faSearchMinus} />
                  </button>
                  <button
                    onClick={onRotateButton}
                    type='button'
                    title='Rotate'
                    className='pdf-embedded-view-tools--rotate'
                  >
                    <FontAwesomeIcon icon={faUndoAlt} flip='horizontal' />
                  </button>
                  <button
                    onClick={handleExpandClicked}
                    type='button'
                    title='Full Screen'
                    className='pdf-embedded-view-tools--fullscreen'
                  >
                    <FontAwesomeIcon icon={faExpandArrowsAlt} />
                  </button>
                </div>
              </div>
              <TransformComponent>
                <Page
                  pageNumber={page}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  scale={PageScale}
                  rotate={pageRotation}
                />
              </TransformComponent>
            </div>
          )}
        </TransformWrapper>
      </Document>
    </div>
  );
};
