import React from 'react';
import { connect } from 'react-redux';
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faQuestionCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { flashActions } from '../../actions';
import { flashConstants } from '../../constants';

import './Flash.module.scss';

const Flash = ({ flashType, flashMessage, dispatch }) => {
  if (!flashType) return null;

  const flashIcon = () => {
    switch (flashType) {
      case flashConstants.TYPES.SUCCESS:
        return <FontAwesomeIcon icon={faCheckCircle} size='lg' />;
      case flashConstants.TYPES.ERROR:
        return <FontAwesomeIcon icon={faExclamationTriangle} size='lg' />;
      case flashConstants.TYPES.DANGER:
        return <FontAwesomeIcon icon={faExclamationTriangle} size='lg' />;
      case flashConstants.TYPES.INFO:
        return <FontAwesomeIcon icon={faInfoCircle} size='lg' />;
      case flashConstants.TYPES.WARNING:
        return <FontAwesomeIcon icon={faQuestionCircle} size='lg' />;
      default:
        return null;
    }
  };

  return (
    <div className={`flash flash--active flash--${flashType}`}>
      <div className='flash__text'>
        <span className='flash__icon'>{flashIcon()}</span>
        {flashMessage}
      </div>
      <button
        type='button'
        className={`flash__close flash--${flashType}`}
        onClick={() => dispatch(flashActions.hide())}
      >
        <FontAwesomeIcon icon={faTimes} size='lg' />
      </button>
    </div>
  );
};

export default connect((state) => state.flash)(Flash);
