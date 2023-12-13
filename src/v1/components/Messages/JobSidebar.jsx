import React from 'react';
import { Avatar } from '../Avatar';
import { Link } from '../index';
import './JobSidebar.module.scss';

export const JobSidebar = ({ jobData }) => {
  const { inMessage, document, building } = jobData;

  // Checks if there are images and renders no more than 3
  const selectRecentImages = () => {
    const imageArrayLength = document.images.length;
    if (imageArrayLength >= 3) {
      const newArray = document.images.slice(-3);
      return newArray.map((image) => (
        <img src={image} alt='name' className='preview-image' key={image} />
      ));
    }
    if (imageArrayLength >= 1 && imageArrayLength < 3) {
      const newArray = document.images.slice(-imageArrayLength);
      return newArray.map((image) => <img src={image} alt='name' className='preview-image' />);
    }
    return <div className='no-images-message'>Nothing to display</div>;
  };

  return (
    <>
      <div className='right-sidebar-content job-content'>
        <div className='sidebar-job-details'>
          <h5>Job Details</h5>
          <span className='sidebar-job-id'>ID: {document.id}</span>
        </div>
        <div className='sidebar-content'>
          <strong>Description</strong>
          <div className='sidebar-job-description'>{document.description}</div>
        </div>
        <div className='sidebar-content'>
          <strong>Images / videos</strong>
          <div className='preview-image-row'>{selectRecentImages()}</div>
        </div>
        <div className='sidebar-contacts sidebar-content'>
          <strong>Contacts in this message</strong>
          {inMessage
            ? inMessage.map((user) => (
                <div className='siderbar-individual-contact' key={user.firstName}>
                  <div>
                    <Avatar {...user} size='small' className='sidebar-avatar' />
                    <span>{user.label}</span>
                  </div>
                  <span className='sidebar-text-item'>Association</span>
                </div>
              ))
            : null}
        </div>
        <div className='sidebar-content google-map'>
          <strong>The building</strong>
        </div>
      </div>
      <Link href={`/document-preview/${document.id}`} classNameProp='sidebar-view-document'>
        <button type='button' className='button primary sidebar-view-document-button'>
          View Job Page
        </button>
      </Link>
    </>
  );
};
