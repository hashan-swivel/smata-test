import React from 'react';
import './DeleteModal.module.scss';

export const DeleteModal = (props) => {
  const { setDeleteModal, handleDelete, deletion } = props;
  return (
    <div className='delete-modal-container'>
      <div className='delete-modal-container-inner'>
        <h3 className='notice-title'>Are you sure you want to delete it?</h3>
        <div className='delete_modal_btn_box'>
          <button
            type='button'
            onClick={() => {
              setDeleteModal(false);
            }}
            className='cancel-btn'
          >
            Cancel
          </button>
          <button type='button' onClick={handleDelete} className='delete-btn'>
            {deletion ? 'Deleting' : 'Delete'}{' '}
          </button>
        </div>
      </div>
    </div>
  );
};
