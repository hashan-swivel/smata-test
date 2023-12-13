import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  faExpandArrowsAlt,
  faSearchMinus,
  faSearchPlus,
  faUndoAlt
} from '@fortawesome/free-solid-svg-icons';
import { documentConstants } from '../../../constants';

import './OtherEmbeddedView.module.scss';

export const OtherEmbeddedView = ({ file, type, handleExpandClicked }) => {
  const [rotation, setRotation] = useState(0);

  const onRotateButton = () => {
    setRotation(rotation === 270 ? 0 : rotation + 90);
  };

  const previewFrame = () => {
    if (documentConstants.IMAGE_PREVIEWABLE_TYPES.includes(type)) {
      return (
        <img
          src={file}
          alt='file'
          className='other-embedded-view-content'
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      );
    }

    if (documentConstants.MS_OFFICE_PREVIEWABLE_TYPES.includes(type)) {
      return (
        <iframe
          className='other-embedded-view-content'
          frameBorder='0'
          title='MS office embedded iframe'
          style={{ transform: `rotate(${rotation}deg)`, minHeight: '70vh' }}
          src={`${documentConstants.MS_OFFICE_WEB_VIEWER}?src=${file}&rs=${navigator.language}&ui=${navigator.language}`}
        />
      );
    }

    return (
      <div
        className='other-embedded-view-content'
        style={{
          minHeight: '66vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div className='other-embedded-view-content--not-previewable-placeholder'>
          <h3>PREVIEW IS NOT AVAILABLE</h3>
        </div>
      </div>
    );
  };

  return (
    <div className='other-embedded-view-wrapper'>
      <TransformWrapper
        defaultScale={1}
        defaultPositionX={200}
        defaultPositionY={100}
        wheel={false}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <div className='other-embedded-view-container'>
            <div className='other-embedded-view-header'>
              <div className='other-embedded-view-tools'>
                <button
                  onClick={zoomIn}
                  type='button'
                  title='Zoom In'
                  className='other-embedded-view-tools--zoom-in'
                >
                  <FontAwesomeIcon icon={faSearchPlus} />
                </button>
                <button
                  onClick={zoomOut}
                  type='button'
                  title='Zoom Out'
                  className='other-embedded-view-tools--zoom-out'
                >
                  <FontAwesomeIcon icon={faSearchMinus} />
                </button>
                <button
                  onClick={onRotateButton}
                  type='button'
                  title='Rotate'
                  className='other-embedded-view-tools--rotate'
                >
                  <FontAwesomeIcon icon={faUndoAlt} flip='horizontal' />
                </button>
                <button
                  onClick={handleExpandClicked}
                  type='button'
                  title='Full Screen'
                  className='other-embedded-view-tools--fullscreen'
                >
                  <FontAwesomeIcon icon={faExpandArrowsAlt} />
                </button>
              </div>
            </div>
            <TransformComponent>{previewFrame()}</TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
