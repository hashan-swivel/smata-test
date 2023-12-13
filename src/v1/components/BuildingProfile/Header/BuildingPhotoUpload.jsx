import React from 'react';
import './BuildingPhotoUpload.module.scss';

export const BuildingPhotoUpload = ({ openUploadModal, canAddImage }) => (
  <div className='empty-building-image-container'>
    <img className='empty-building-image' src='/building_profile.png' alt='Upload building' />
    {canAddImage && (
      <button
        type='button'
        className='button secondary empty-building-upload-button'
        onClick={openUploadModal}
      >
        Upload Building Photo
      </button>
    )}
  </div>
);
