import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import { Avatar } from '../Avatar';
import './ImageModal.module.scss';

export const ImageModal = ({ image }) => {
  return (
    <div className='image-modal-container'>
      {/*<h3 className="upcoming-title">Image Modal</h3>*/}
      <div className='image_box'>
        <img src={image.image_url} alt={image.name} />
      </div>
      <p className='image-description'>{image.description}</p>
    </div>
  );
};
