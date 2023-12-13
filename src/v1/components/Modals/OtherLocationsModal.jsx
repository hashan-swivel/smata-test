import React, { useState } from 'react';
import { connect } from 'react-redux';
import ModalContainer from './ModalContainer';

import './OtherLocationsModal.module.scss';

const OtherLocationsModal = ({ locations }) => (
  <ModalContainer
    title='OTHER BUILDING LOCATIONS'
    reactModalProps={{
      className: 'c-modal__container c-modal__container--lg other-locations-modal'
    }}
  >
    <div className='c-modal__body'>
      <div className='locations-wrapper'>
        <ul>
          {locations?.slice(1).map((location) => (
            <li>{location.location_name}</li>
          ))}
        </ul>
      </div>
    </div>
  </ModalContainer>
);

export default connect((state) => state.modal)(OtherLocationsModal);
